export {
  default as MakeCodeFrame,
  type MakeCodeFrameProps,
} from './MakeCodeFrame.js';

export {
  default as useMakeCodeRenderBlocks,
  type UseMakeCodeRenderBlocksReturn,
} from './useMakeCodeRenderBlocks.js';

export { MakeCodeRenderBlocksProvider } from './MakeCodeRenderBlocksProvider.js';
export {
  default as MakeCodeBlocksRendering,
  type MakeCodeBlocksRenderingProps,
} from './MakeCodeBlocksRendering.js';

export {
  defaultMakeCodeProject,
  emptyMakeCodeProject,
} from '../vanilla/examples.js';

export {
  MakeCodeFrameDriver,
  createMakeCodeURL,
} from '../vanilla/makecode-frame-driver.js';

export { BlockLayout } from '../vanilla/pxt.js';

export type {
  CreateEvent,
  EditorContentLoadedRequest,
  EditorEvent,
  EditorMessageTutorialCompletedEventRequest,
  EditorMessageTutorialEventRequest,
  EditorMessageTutorialExitEventRequest,
  EditorMessageTutorialLoadedEventRequest,
  EditorMessageTutorialProgressEventRequest,
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
  ToolboxBlockDefinition,
  ToolboxCategoryDefinition,
  UIEvent,
} from '../vanilla/pxt.js';
