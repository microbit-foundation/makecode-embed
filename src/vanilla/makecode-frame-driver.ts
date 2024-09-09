import {
  EditorContentLoadedRequest,
  EditorEvent,
  EditorMessageGetToolboxCategoriesRequest,
  EditorMessageGetToolboxCategoriesResponse,
  EditorMessageImportExternalProjectRequest,
  EditorMessageImportExternalProjectResponse,
  EditorMessageImportProjectRequest,
  EditorMessageImportTutorialRequest,
  EditorMessageNewProjectRequest,
  EditorMessageOpenHeaderRequest,
  EditorMessageRenderByBlockIdResponse,
  EditorMessageRenderPythonResponse,
  EditorMessageRenderXmlResponse,
  EditorMessageRequest,
  EditorMessageResponse,
  EditorMessageSetHighContrastRequest,
  EditorMessageSetScaleRequest,
  EditorMessageSetSimulatorFullScreenRequest,
  EditorMessageTutorialEventRequest,
  EditorSetLanguageRestriction,
  EditorShareResponse,
  EditorWorkspaceEvent,
  EditorWorkspaceSaveRequest,
  EditorWorkspaceSyncRequest,
  EditorWorkspaceSyncResponse,
  ImportExternalProjectOptions,
  ImportFileOptions,
  ImportProjectOptions,
  InfoMessage,
  LanguageRestriction,
  Project,
  ProjectCreationOptions,
  ProjectFilters,
  RenderBlocksOptions,
  RenderByBlockIdOptions,
  RenderXmlOptions,
  ShareResult,
  StartActivityOptions,
  ToolboxCategoryDefinition,
} from './pxt.js';

// Adapts the MakeCode types into a discriminated union
type EditorMessageRequestUnion =
  | EditorMessageSetScaleRequest
  | EditorMessageGetToolboxCategoriesRequest
  | EditorMessageImportExternalProjectRequest
  | EditorMessageImportProjectRequest
  | EditorMessageImportTutorialRequest
  | EditorMessageNewProjectRequest
  | EditorMessageRequest;

interface EditorShareOptions {
  headerId: string;
  projectName: string;
}

export interface Options {
  /**
   * A function that provides the initial set of projects to be used when initialising MakeCode.
   *
   * This will also be used if the iframe reloads itself.
   *
   * The projects will receive updates via `onWorkspaceSave` and should be stored keyed by header
   * id.
   */
  initialProjects: () => Promise<Project[]>;

  /**
   * Set this to a value representing your app.
   */
  controllerId?: string;

  /**
   * Filters affecting the configuration of MakeCode.
   */
  filters?: ProjectFilters;

  /**
   * Whether to show the search bar.
   */
  searchBar?: boolean;

  /**
   * Called when the main editor area is ready (e.g. after a project load).
   */
  onEditorContentLoaded?(event: EditorContentLoadedRequest): void;

  /**
   * This is not typically needed as the driver responds to MakeCode's request to sync using the initialProjects option.
   */
  onWorkspaceSync?(event: EditorWorkspaceSyncRequest): void;

  /**
   * Called when the workspace sync is complete.
   */
  onWorkspaceLoaded?(event: EditorWorkspaceSyncRequest): void;

  /**
   * Implement this to update the data store that `initialProjects` reads from.
   */
  onWorkspaceSave?(event: EditorWorkspaceSaveRequest): void;

  /**
   * This is only called via MakeCode UI, which is not visible in embedded mode.
   *
   * It's intention is to delete all projects/settings.
   */
  onWorkspaceReset?(event: EditorWorkspaceSyncRequest): void;

  /**
   * Editor events including detail on block usage and help interactions.
   */
  onWorkspaceEvent?(event: EditorEvent): void;

  /**
   * Updates as a user progresses through a tutorial.
   */
  onTutorialEvent?(event: EditorMessageTutorialEventRequest): void;

  /**
   * Requests the embedding app handles a download.
   *
   * Applies only with `controller` set to `2`.
   */
  onDownload?: (download: { name: string; hex: string }) => void;

  /**
   * Requests the embedding app handles a save.
   *
   * Applies only with `controller` set to `2`.
   */
  onSave?: (save: { name: string; hex: string }) => void;

  /**
   * Requests the embedding app handles a press/tap on the back arrow.
   *
   * Applies only with `controller` set to `2`.
   */
  onBack?: () => void;

  /**
   * Requests the embedding app handles a long press/tap on the back arrow.
   * This is optional.
   *
   * Applies only with `controller` set to `2`.
   */
  onBackLongPress?: () => void;
}

/**
 * A driver for MakeCode.
 *
 * This stores state to correlate requests/responses to and from MakeCode.
 */
export class MakeCodeFrameDriver {
  private ready = false;
  private messageQueue: Array<unknown> = [];
  private nextId = 0;
  private pendingResponses = new Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (value: unknown) => void;
      message: unknown;
    }
  >();

  private listener = (event: MessageEvent) => {
    if (event.origin !== 'https://makecode.microbit.org') {
      return;
    }
    const { data } = event;
    if (typeof data !== 'object') {
      return;
    }

    // I think 'editorcontentloaded' isn't useful here in controller scenarios but needs confirming.
    // Might be the right option when waiting to render blocks or similar?
    if (
      data.type === 'iframeclientready' ||
      (data.type === 'pxthost' && data.action === 'editorcontentloaded')
    ) {
      this.ready = true;
      this.messageQueue.forEach((m) => this.sendMessageNoReadyCheck(m));
      this.messageQueue.length = 0;
    }

    if (data.type === 'pxteditor') {
      // A reply to a message we sent.  Some of these have useful data in a
      // semi-standard resp field but others have useful top-level fields so we
      // leave it to the caller to handle each message type.
      const pendingResponse = this.pendingResponses.get(data.id);
      if (pendingResponse) {
        this.pendingResponses.delete(data.id);
        const { resolve, reject } = pendingResponse;
        if (data.success) {
          resolve(data);
        } else {
          reject(
            data.error ??
              new Error(
                'MakeCode response was not successful with no error specified'
              )
          );
        }
      }
    } else if (data.type === 'pxthost') {
      this.handleWorkspaceSync(data);

      switch (data.action) {
        case 'event': {
          // Can't make these happen.
          // Might require "allowSimTelemetry". But even then I can only see them fired with type: "pxtsim".
          return;
        }
        case 'simevent': {
          // So far as I can tell these don't fire.
          // The logic in MakeCode doesn't seem to allow them in controller mode, only if allowParentController is set.
          // In other scenarios either being true is sufficient.
          return;
        }
        case 'tutorialevent': {
          return this.options.onTutorialEvent?.(
            data as EditorMessageTutorialEventRequest
          );
        }
        case 'workspacesave': {
          return this.options.onWorkspaceSave?.(
            data as EditorWorkspaceSaveRequest
          );
        }
        case 'workspaceevent': {
          return this.options.onWorkspaceEvent?.(
            (data as EditorWorkspaceEvent).event
          );
        }
        case 'workspacereset': {
          return this.options.onWorkspaceReset?.(
            data as EditorWorkspaceSyncRequest
          );
        }
        case 'workspacesync': {
          return this.options.onWorkspaceSync?.(
            data as EditorWorkspaceSyncRequest
          );
        }
        case 'workspaceloaded': {
          return this.options.onWorkspaceLoaded?.(
            data as EditorWorkspaceSyncRequest
          );
        }
        case 'workspacediagnostics': {
          // So far as I can tell these don't fire.
          // The logic in MakeCode doesn't seem to allow them in controller mode, only if allowParentController is set.
          // In other scenarios either being true is sufficient.
          return;
        }
        case 'editorcontentloaded': {
          return this.options.onEditorContentLoaded?.(
            data as EditorContentLoadedRequest
          );
        }
        case 'projectcloudstatus': {
          // Requesting cloud status likely only works on the same domain as MakeCode
          // so isn't implemented.
          return;
        }
      }
    } else if ('download' in data) {
      // Native app oriented event that doesn't have a 'type' field.
      this.options.onDownload?.({
        name: data.name,
        hex: data.download,
      });
    } else if ('save' in data) {
      // Native app oriented event that doesn't have a 'type' field.
      this.options.onSave?.({
        name: data.name,
        hex: data.save,
      });
    } else if ('cmd' in data) {
      // Native app oriented event that doesn't have a 'type' field.
      switch (data.cmd) {
        case 'backtap':
          return this.options.onBack?.();
        case 'backpress':
          return this.options.onBackLongPress?.();
      }
    }
  };

  constructor(
    private options: Options,
    private iframe: () => HTMLIFrameElement | undefined
  ) {}

  initialize() {
    window.addEventListener('message', this.listener);
    // If the iframe is already loaded this will ensure we still initialize correctly
    this.iframe()?.contentWindow?.postMessage(
      {
        type: 'iframeclientready',
      },
      '*'
    );
  }

  setOptions(options: Options) {
    this.options = options;
  }

  dispose() {
    window.removeEventListener('message', this.listener);
  }

  private sendRequest = (
    message: EditorMessageRequestUnion
  ): Promise<unknown> => {
    message.response = true;
    if (!message.id) {
      message.id = (this.nextId++).toString();
    }
    const id = message.id;
    const p = new Promise((resolve, reject) => {
      this.pendingResponses.set(id, { resolve, reject, message });
    });
    this.sendMessage(message);
    return p;
  };

  private sendMessage = (message: unknown) => {
    if (this.ready) {
      this.sendMessageNoReadyCheck(message);
    } else {
      this.messageQueue.push(message);
    }
  };

  private sendMessageNoReadyCheck = (message: unknown) => {
    this.iframe()?.contentWindow?.postMessage(message, '*');
  };

  private async handleWorkspaceSync(
    event: EditorWorkspaceSyncRequest | EditorWorkspaceSaveRequest
  ) {
    let error: unknown = undefined;
    try {
      if (event.action === 'workspacesync') {
        const projects = await this.options.initialProjects();
        const { filters, searchBar, controllerId } = this.options;
        // I think the MakeCode driver waits for ready here but that doesn't work with live MakeCode.
        this.sendMessageNoReadyCheck({
          ...event,
          success: true,
          projects,
          editor: {
            filters,
            searchBar,
            controllerId,
          },
        } as EditorWorkspaceSyncResponse);
      } else if (event.action === 'workspacesave') {
        this.options.onWorkspaceSave?.(event);
      }
    } catch (e) {
      error = e;
      console.error(e);
    } finally {
      if (event.response) {
        this.sendMessageNoReadyCheck({
          type: 'pxthost',
          id: event.id,
          success: !error,
          error,
        } as EditorMessageResponse);
      }
    }
  }

  /**
   * Switch the MakeCode to blocks mode.
   *
   * You can find the current mode in the project.
   */
  async switchBlocks(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'switchblocks',
    });
  }

  /**
   * Switch the MakeCode to JavaScript mode.
   *
   * You can find the current mode in the project.
   */
  async switchJavascript(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'switchjavascript',
    });
  }

  /**
   * Switch the MakeCode to JavaScript mode.
   *
   * You can find the current mode in the project.
   */
  async switchPython(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'switchpython',
    });
  }

  /**
   * Start the simulator.
   */
  async startSimulator(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'startsimulator',
    });
  }

  /**
   * Restarts the simulator.
   */
  async restartSimulator(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'restartsimulator',
    });
  }

  /**
   * Stops the simulator.
   */
  async stopSimulator(options?: {
    /**
     * Optionally unload the simulator (removes its UI)
     */
    unload: boolean;
  }): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'stopsimulator',
      ...options,
    });
  }

  /**
   * Hides the simulator. The user can reverse this via the UI.
   */
  async hideSimulator(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'hidesimulator',
    });
  }

  /**
   * Show the simulator. The user can reverse this via the UI.
   */
  async showSimulator(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'showsimulator',
    });
  }

  /**
   * Closes the toolbox and similar UX.
   */
  async closeFlyout(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'closeflyout',
    });
  }

  /**
   * Create a new project.
   */
  async newProject(options?: ProjectCreationOptions): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'newproject',
      options,
    });
  }

  /**
   * Import a project.
   *
   * The project needs to have a header.
   * Otherwise consider `newProject`
   */
  async importProject(options: ImportProjectOptions): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'importproject',
      ...options,
    });
  }

  /**
   * Create a URL that can be used to import a project into MakeCode.
   *
   * This can be useful if MakeCode is embedded in one application but you want to be able to export to non-embedded MakeCode.
   *
   * The applications must be part of the same site as the process relies on shared client-side storage.
   *
   * The URL must be used immediately as it won't remain valid if another call is made.
   */
  async importExternalProject(
    options: ImportExternalProjectOptions
  ): Promise<{ importUrl: string }> {
    const response = (await this.sendRequest({
      type: 'pxteditor',
      action: 'importexternalproject',
      ...options,
    })) as EditorMessageImportExternalProjectResponse;
    return response.resp;
  }

  /**
   * Import a tutorial from markdown text.
   *
   * See also `startActivity`.
   */
  async importTutorial(options: { markdown: string }): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'importtutorial',
      ...options,
    });
  }

  /**
   * Open a MakeCode project.
   */
  async openHeader(headerId: string): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'openheader',
      headerId,
    } as EditorMessageOpenHeaderRequest);
  }

  /**
   * Undo.
   */
  async undo(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'undo',
    });
  }

  /**
   * Redo.
   */
  async redo(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'redo',
    });
  }

  // It's confusingly different from https://makecode.microbit.org/blocks-embed#:~:text=Render%20Blocks%20Response%20message,as%20an%20image%20data%20source
  // Would be good to see if it takes all those options in practice.
  async renderBlocks(options: RenderBlocksOptions): Promise<string> {
    const result = (await this.sendRequest({
      type: 'pxteditor',
      action: 'renderblocks',
      ...options,
    })) as { resp: string };
    return result.resp;
  }

  async renderPython(options: { ts: string }): Promise<string | undefined> {
    const { resp } = (await this.sendRequest({
      type: 'pxteditor',
      action: 'renderpython',
      ...options,
    })) as EditorMessageRenderPythonResponse;
    return resp;
  }

  async renderXml(options: RenderXmlOptions): Promise<string | undefined> {
    const { resp } = (await this.sendRequest({
      type: 'pxteditor',
      action: 'renderxml',
      ...options,
    })) as EditorMessageRenderXmlResponse;
    return resp;
  }

  /**
   * Renders an individual block by type (e.g. basic_show_id) to an SVG data URI.
   */
  async renderByBlockId(
    options: RenderByBlockIdOptions
  ): Promise<string | undefined> {
    const { resp } = (await this.sendRequest({
      type: 'pxteditor',
      action: 'renderbyblockid',
      ...options,
    })) as EditorMessageRenderByBlockIdResponse;
    return resp;
  }

  async setScale({ scale }: { scale: number }): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'setscale',
      scale,
    });
  }

  /**
   * See https://github.com/microsoft/pxt-microbit/issues/5456
   *
   * Tutorial tool sharing link ID from https:*makecode.com/tutorial-tool prefixed with 'S'
   * path: 'S96773-99918-18806-19059',
   *
   * Built-in tutorial
   * path: '/projects/rock-paper-scissors',
   *
   * GitHub repo (no trailing .md, no blob/main cruft, tag versions)
   *
   * You get a series of "tutorialevent" actions tracking load and progress
   * which we'd need to add support for at least to error handle the load.
   */
  async startActivity(options: StartActivityOptions): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'startactivity',

      ...options,
    });
  }

  async saveProject(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'saveproject',
    });
  }

  async compile(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'compile',
    });
  }

  async unloadProject(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'unloadproject',
    });
  }

  async shareProject(options: EditorShareOptions): Promise<ShareResult> {
    const { resp } = (await this.sendRequest({
      type: 'pxteditor',
      action: 'shareproject',
      ...options,
    })) as EditorShareResponse;
    return resp;
  }

  /**
   * Change the language restriction (e.g. move to just JavaScript).
   */
  async setLanguageRestriction(
    restriction: LanguageRestriction
  ): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'setlanguagerestriction',
      restriction,
    } as EditorSetLanguageRestriction);
  }

  async getToolboxCategories(options?: {
    advanced?: boolean;
  }): Promise<ToolboxCategoryDefinition[]> {
    // Oddly the type seems to be for the resp field rather than the message
    const {
      resp: { categories },
    } = (await this.sendRequest({
      type: 'pxteditor',
      action: 'gettoolboxcategories',
      ...options,
    })) as { resp: EditorMessageGetToolboxCategoriesResponse };
    return categories;
  }

  async toggleDebugSloMo(options?: { invervalSpeed?: number }): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'toggletrace',
      ...options,
    });
  }

  async setDebugSlowMo(options: {
    enabled: boolean;
    intervalSpeed?: number;
  }): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'settracestate',
      ...options,
    });
  }

  async toggleHighContrast(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'togglehighcontrast',
    });
  }

  async setHighContrast(on: boolean): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'sethighcontrast',
      on,
    } as EditorMessageSetHighContrastRequest);
  }

  async toggleGreenScreen(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'togglegreenscreen',
    });
  }

  async setSimulatorFullScreen(enabled: boolean): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'setsimulatorfullscreen',
      enabled,
    } as EditorMessageSetSimulatorFullScreenRequest);
  }

  async print(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'print',
    });
  }

  async pair(): Promise<void> {
    await this.sendRequest({
      type: 'pxteditor',
      action: 'pair',
    });
  }

  async info(): Promise<InfoMessage> {
    const { resp } = (await this.sendRequest({
      type: 'pxteditor',
      action: 'info',
    })) as EditorMessageResponse & { resp: InfoMessage };
    return resp;
  }

  /**
   * Import a file.
   *
   * This works with hex and mkcd files.
   *
   * TODO: Other types may also be supported.
   */
  importFile(options: ImportFileOptions): void {
    this.sendMessage({
      type: 'importfile',
      ...options,
    });
  }
}

export const createMakeCodeURL = (
  baseUrl: string | undefined,
  version: string | undefined,
  lang: string | undefined,
  controller: number | undefined,
  queryParams: Record<string, string> | undefined
): string => {
  const url = new URL(
    baseUrl + (version ? `/${encodeURIComponent(version)}` : '')
  );
  if (lang) {
    url.searchParams.set('lang', lang);
  }
  if (controller) {
    url.searchParams.set('controller', controller.toString());
  }
  if (queryParams) {
    for (const [k, v] of Object.entries(queryParams)) {
      url.searchParams.set(k, v);
    }
  }
  return url.toString();
};
