export {
  default as MakeCodeFrame,
  type MakeCodeFrameProps,
} from './react/MakeCodeFrame.js';

export {
  default as useMakeCodeRenderBlocks,
  type UseMakeCodeRenderBlocksReturn,
} from './react/useMakeCodeRenderBlocks.js';

export { MakeCodeRenderBlocksProvider } from './react/MakeCodeRenderBlocksProvider.js';
export {
  default as MakeCodeBlocksRendering,
  type MakeCodeBlocksRenderingProps,
} from './react/MakeCodeBlocksRendering.js';

export {
  defaultMakeCodeProject,
  emptyMakeCodeProject,
} from './vanilla/examples.js';

export {
  MakeCodeFrameDriver,
  createMakeCodeURL,
} from './vanilla/makecode-frame-driver.js';

export { BlockLayout } from './vanilla/pxt.js';

export { createMakeCodeRenderBlocks } from './vanilla/makecode-render-blocks.js';

export type {
  MakeCodeRenderBlocksOptions,
  MakeCodeRenderBlocksReturn,
  RenderBlocksResponse,
  RenderBlocksRequest,
} from './vanilla/makecode-render-blocks.js';

export type {
  CreateEvent,
  EditorContentLoadedRequest,
  EditorEvent,
  EditorMessageTutorialCompletedEventRequest,
  EditorMessageTutorialEventRequest,
  EditorMessageTutorialExitEventRequest,
  EditorMessageTutorialLoadedEventRequest,
  EditorMessageTutorialProgressEventRequest,
  EditorWorkspaceSaveRequest,
  EditorWorkspaceSyncRequest,
  ImportExternalProjectOptions,
  ImportFileOptions,
  ImportProjectOptions,
  InfoMessage,
  LanguageRestriction,
  MakeCodeProject,
  ProjectCreationOptions,
  ProjectFilters,
  RenderBlocksOptions,
  RenderByBlockIdOptions,
  RenderXmlOptions,
  ShareResult,
  StartActivityOptions,
  ToolboxBlockDefinition,
  ToolboxCategoryDefinition,
  UIEvent,
} from './vanilla/pxt.js';
