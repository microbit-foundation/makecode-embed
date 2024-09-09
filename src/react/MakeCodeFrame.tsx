import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  createMakeCodeURL,
  MakeCodeFrameDriver,
  Options,
} from '../vanilla/makecode-frame-driver.js';
import {
  EditorContentLoadedRequest,
  EditorEvent,
  EditorMessageTutorialEventRequest,
  EditorWorkspaceSaveRequest,
  EditorWorkspaceSyncRequest,
  Project,
  ProjectFilters,
} from '../vanilla/pxt.js';

const styles: Record<string, React.CSSProperties> = {
  iframe: {
    width: '100%',
    flexGrow: 1,
    border: 'none',
  },
};

export interface MakeCodeFrameProps
  extends React.ComponentPropsWithoutRef<'iframe'> {
  baseUrl?: string;
  version?: string;
  lang?: string;
  controller?: 1 | 2;
  // You can use these to specify query variants or other options not directly supported by this component
  // https://github.com/microsoft/pxt-microbit/blob/master/pxtarget.json#L605C6-L605C14
  queryParams?: Record<string, string>;

  initialProjects: () => Promise<Project[]>;

  controllerId?: string;
  filters?: ProjectFilters;
  searchBar?: boolean;

  onDownload?: (download: { name: string; hex: string }) => void;
  onSave?: (save: { name: string; hex: string }) => void;
  onBack?: () => void;
  onBackLongPress?: () => void;

  onEditorContentLoaded?(event: EditorContentLoadedRequest): void;
  onWorkspaceLoaded?(event: EditorWorkspaceSyncRequest): void;
  onWorkspaceSync?(event: EditorWorkspaceSyncRequest): void;

  /**
   * This is only called via MakeCode UI that's not visible in embedded mode.
   *
   * It's intention is to delete all projects/settings.
   */
  onWorkspaceReset?(event: EditorWorkspaceSyncRequest): void;

  onWorkspaceEvent?(event: EditorEvent): void;
  onWorkspaceSave?(event: EditorWorkspaceSaveRequest): void;
  onTutorialEvent?(event: EditorMessageTutorialEventRequest): void;
}

const MakeCodeFrame = forwardRef<MakeCodeFrameDriver, MakeCodeFrameProps>(
  function MakeCode(props, ref) {
    const {
      baseUrl = 'https://makecode.microbit.org',
      version,
      lang,
      controller,
      queryParams,

      initialProjects,
      controllerId,
      filters,
      searchBar,

      onDownload,
      onSave,
      onBack,
      onBackLongPress,
      onEditorContentLoaded,
      onWorkspaceLoaded,
      onWorkspaceSync,
      onWorkspaceReset,
      onWorkspaceEvent,
      onWorkspaceSave,
      onTutorialEvent,

      ...rest
    } = props;
    const options = useMemo(() => {
      return {
        initialProjects,
        controllerId,
        filters,
        searchBar,

        onDownload,
        onSave,
        onBack,
        onBackLongPress,
        onEditorContentLoaded,
        onWorkspaceLoaded,
        onWorkspaceSync,
        onWorkspaceReset,
        onWorkspaceEvent,
        onWorkspaceSave,
        onTutorialEvent,
      };
    }, [
      controllerId,
      filters,
      initialProjects,
      onBack,
      onBackLongPress,
      onDownload,
      onEditorContentLoaded,
      onSave,
      onTutorialEvent,
      onWorkspaceEvent,
      onWorkspaceLoaded,
      onWorkspaceReset,
      onWorkspaceSave,
      onWorkspaceSync,
      searchBar,
    ]);

    // Reload MakeCode if the URL changes
    const src = createMakeCodeURL(
      baseUrl,
      version,
      lang,
      controller,
      queryParams
    );
    return (
      <MakeCodeFrameInner
        {...rest}
        ref={ref}
        key={src}
        src={src}
        options={options}
      />
    );
  }
);

interface MakeCodeFrameInnerProps
  extends React.ComponentPropsWithoutRef<'iframe'> {
  options: Options;
}

const MakeCodeFrameInner = forwardRef<
  MakeCodeFrameDriver,
  MakeCodeFrameInnerProps
>(function MakeCodeFrameInner(props, ref) {
  const { options, style, ...rest } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // We keep a fixed driver (which has state for messages) and update its options as needed.
  const driverRef = useRef(
    new MakeCodeFrameDriver(options, () => iframeRef.current ?? undefined)
  );
  useEffect(() => {
    const driver = driverRef.current;
    driver.initialize();
    return () => {
      driver.dispose();
    };
  }, []);
  useEffect(() => {
    driverRef.current.setOptions(options);
  }, [options]);
  useImperativeHandle(ref, () => driverRef.current, []);

  return (
    <iframe
      ref={iframeRef}
      title="MakeCode"
      style={{ ...styles.iframe, ...style }}
      allow="usb; autoplay; camera; microphone;"
      {...rest}
    />
  );
});

export default MakeCodeFrame;
