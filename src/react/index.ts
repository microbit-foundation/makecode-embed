export {
  default as MakeCodeFrame,
  type MakeCodeFrameProps,
} from './MakeCodeFrame.js';

export {
  default as useMakeCodeRenderBlocks,
  type UseMakeCodeRenderBlocksReturn,
} from './useMakeCodeRenderBlocks.js';

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
