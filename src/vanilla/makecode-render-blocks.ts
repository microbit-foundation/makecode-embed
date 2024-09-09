/**
 * MakeCode handling that does not depend on React.
 */

import { BlockLayout, Project } from './pxt.js';

const disposedMessage = 'Disposed';
const makecodeFailedToLoadMessage = 'Failed to load MakeCode to render blocks.';
type MakeCodeState = 'disabled' | 'loading' | 'error' | 'ready';

export interface MakeCodeRenderBlocksOptions {
  // Avoids loading MakeCode if set.
  disabled?: boolean;
  version?: string;
  lang?: string;
}

export interface MakeCodeRenderBlocksReturn {
  renderBlocks: (req: RenderBlocksRequest) => Promise<RenderBlocksResponse>;
  initialize: () => void;
  dispose: () => void;
}

export interface RenderBlocksRequest {
  code: string | Project;
  options?: {
    packageId?: string;
    package?: string;
    snippetMode?: boolean;
    layout?: BlockLayout;
  };
}

export interface RenderBlocksResponse {
  uri?: string;
  css?: string;
  svg?: string;
  width?: number;
  height?: number;
}

interface RenderBlocksRequestMessage {
  type: 'renderblocks';
  // The ID is required by MakeCode but we set it.
  id?: string;
  code: string;
  options?: {
    packageId?: string;
    package?: string;
    snippetMode?: boolean;
    layout?: BlockLayout;
    assets?: Record<string, string>;
  };
}

interface RenderBlocksResponseMessage {
  source: 'makecode';
  type: 'renderblocks';
  id: string;
  uri?: string;
  css?: string;
  svg?: string;
  width?: number;
  height?: number;
  error?: string;
}

type RequestInputType = 'text' | 'blocks';

interface RenderBlocksRequestResponse {
  input: Project | string;
  sent: boolean;
  type: RequestInputType;
  req: RenderBlocksRequestMessage;
  promise: {
    resolve: (v: RenderBlocksResponseMessage) => void;
    reject: (err: string) => void;
  };
}

type PendingRequests = { [id: string]: RenderBlocksRequestResponse };

const createMakeCodeRenderBlocks = (
  options: MakeCodeRenderBlocksOptions
): MakeCodeRenderBlocksReturn => {
  const defaultedOptions: MakeCodeRenderBlocksOptions = {
    ...options,
  };
  const makecodeOrigin = 'https://makecode.microbit.org';

  let iframe: HTMLIFrameElement | undefined;
  let status: MakeCodeState = 'loading';
  const requestStatus = {
    nextRequest: 0,
    pendingRequests: {} as PendingRequests,
  };
  const pendingRequests = requestStatus.pendingRequests;

  const failAllPending = (errorMessage: string) => {
    Object.keys(requestStatus.pendingRequests).forEach((k) => {
      const { promise } = pendingRequests[k];
      delete pendingRequests[k];
      promise.reject(errorMessage);
    });
  };

  const sendPendingIfReady = () => {
    if (status === 'ready') {
      // Possible that dispose has been called by the time we process the message,
      // in which case do nothing.
      if (iframe) {
        Object.values(pendingRequests).forEach((rr) => ensureMessageSent(rr));
      }
    } else if (status === 'error') {
      failAllPending(makecodeFailedToLoadMessage);
    } else if (status === 'disabled') {
      failAllPending('renderBlocks will always fail when explicitly disabled');
    } else {
      // We're loading, we'll send these when done.
    }
  };

  const ensureMessageSent = (rr: RenderBlocksRequestResponse) => {
    if (!rr.sent) {
      rr.sent = true;
      const { req } = rr;
      iframe!.contentWindow!.postMessage(req, makecodeOrigin);
    }
  };

  const findBestCode = (
    code: string | Project,
    ignoreBlocks?: boolean
  ): { type: RequestInputType; code: string } => {
    if (typeof code === 'string') {
      return { code, type: 'text' };
    }
    if (code.text) {
      const blocks = code.text['main.blocks'];
      const text = code.text['main.ts'];
      if (blocks && !ignoreBlocks) {
        return {
          code: blocks,
          type: 'blocks',
        };
      }
      if (text) {
        return {
          code: text,
          type: 'text',
        };
      }
    }
    return { code: '', type: 'text' };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let errorTimeout: any;
  const handleMessage = (ev: MessageEvent) => {
    const msg = ev.data;
    if (ev.source !== iframe?.contentWindow || msg.source !== 'makecode') {
      return;
    }
    switch (msg.type) {
      case 'renderready': {
        window.clearTimeout(errorTimeout);
        status = 'ready';
        sendPendingIfReady();
        break;
      }
      case 'renderblocks': {
        const id: string = msg.id;
        const matchingRequest = pendingRequests[id];
        if (!matchingRequest) {
          return;
        }

        const result = msg as RenderBlocksResponseMessage;
        // This currently happens for extension blocks.
        // We retry with text based rendering.
        // MakeCode beta appears to do this internally.
        if (
          !result.error &&
          !result.width &&
          !result.height &&
          !result.svg &&
          !result.uri
        ) {
          if (matchingRequest.type === 'blocks') {
            matchingRequest.sent = false;
            matchingRequest.type = 'text';
            matchingRequest.req.code = findBestCode(
              matchingRequest.input,
              true
            ).code;
            ensureMessageSent(matchingRequest);
            return;
          } else {
            result.error = 'Internal MakeCode failure.';
          }
        }

        delete pendingRequests[id];
        if (result.error) {
          matchingRequest.promise.reject(result.error);
        } else {
          matchingRequest.promise.resolve(msg as RenderBlocksResponseMessage);
        }
        break;
      }
    }
  };
  return {
    initialize: () => {
      if (options.disabled) {
        return;
      }
      window.addEventListener('message', handleMessage);
      iframe = createIframe(makecodeOrigin, defaultedOptions);
      errorTimeout = setTimeout(() => {
        failAllPending(makecodeFailedToLoadMessage);
        status = 'error';
      }, 30000);
    },
    dispose: () => {
      window.clearTimeout(errorTimeout);
      window.removeEventListener('message', handleMessage);
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      iframe = undefined;
      failAllPending(disposedMessage);
    },
    renderBlocks: (req: RenderBlocksRequest): Promise<RenderBlocksResponse> => {
      const id = requestStatus.nextRequest++ + '';
      const { code, type } = findBestCode(req.code);
      const makecodeRequest: RenderBlocksRequestMessage = {
        id,
        code,
        type: 'renderblocks',
        options: {
          ...req.options,
          // To include files to filesystem
          assets: typeof req.code === 'object' ? req.code.text : undefined,
          package: defaultPackageFromDependencies(req),
        },
      };
      return new Promise((resolve, reject) => {
        pendingRequests[id] = {
          type,
          input: req.code,
          sent: false,
          req: makecodeRequest,
          promise: { resolve, reject },
        };
        sendPendingIfReady();
      });
    },
  };
};

function defaultPackageFromDependencies(
  req: RenderBlocksRequest
): string | undefined {
  // Package can encode the extensions used in a comma separated list in this format:
  // automationbit=github:pimoroni/pxt-automationbit#v0.0.2
  // We can find that list from the JSON passed (but not from blocks or text)
  const _package =
    req.options && req.options.package ? req.options.package : undefined;
  if (
    typeof _package === 'undefined' &&
    typeof req.code === 'object' &&
    req.code.text!['pxt.json']
  ) {
    const parsed = JSON.parse(req.code.text!['pxt.json']);
    if (typeof parsed === 'object') {
      // Cope with extensions with spaces in their names. Otherwise pxt rejects
      // adding the dependency even if it would in normal usage.
      // https://github.com/microbit-foundation/classroom-management-tool/issues/463
      const sanitizedName = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '_');
      const dependencies: Record<string, string> = parsed.dependencies || {};
      const result = Object.keys(dependencies)
        .map((name) => `${sanitizedName(name)}=${dependencies[name]}`)
        .join(',');
      return result;
    }
  }
  return _package;
}

function createIframe(
  makecodeOrigin: string,
  { lang, version }: MakeCodeRenderBlocksOptions
): HTMLIFrameElement {
  const query = `?render=1${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`;
  const src =
    [makecodeOrigin, version, '--docs'].filter(Boolean).join('/') + query;
  const f = document.createElement('iframe');
  f.style.position = 'absolute';
  f.style.width = '1px';
  f.style.height = '1px';
  f.style.border = '0';
  f.style.clip = 'rect(0 0 0 0)';
  f.style.margin = '-1px';
  f.style.padding = '0';
  f.style.overflow = 'hidden';
  f.style.whiteSpace = 'nowrap';
  f.setAttribute('loading', 'eager');
  f.setAttribute('aria-hidden', 'true');
  f.src = src;
  document.body.appendChild(f);
  return f;
}

export default createMakeCodeRenderBlocks;
