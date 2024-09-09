export { MakeCodeFrameDriver } from './makecode-frame-driver.js';

export {
  default as useMakeCodeRenderBlocks,
  type MakeCodeRenderBlocksReturn,
} from './makecode-render-blocks.js';

export {
  defaultMakeCodeProject,
  emptyMakeCodeProject,
} from '../vanilla/examples.js';

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
  ToolboxCategoryDefinition,
  ToolboxBlockDefinition,
  UIEvent,
} from '../vanilla/pxt.js';
