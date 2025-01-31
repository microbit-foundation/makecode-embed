import { Meta, StoryObj } from '@storybook/react';
import {
  createMakeCodeURL,
  MakeCodeFrameDriver,
  Options,
} from '../vanilla/makecode-frame-driver.js';
import { Project } from '../vanilla/pxt.js';
import StoryWrapper from './StoryWrapper.js';
import { defaultMakeCodeProject } from '../vanilla/examples.js';

interface StoryArgs {
  options?: {
    version?: string;
    lang?: string;
    controller?: 1 | 2;
    queryParams?: Record<string, string>;
  };
  project?: Project;
  callbacks?: Partial<Options>;
}

const meta: Meta<StoryArgs> = {
  title: 'makeCodeFrameDriver',
};

export default meta;

type Story = StoryObj<StoryArgs>;

const renderEditor = (args: StoryArgs) => {
  const elementId = 'story-wrapper';

  // Create an iframe element.
  const iframe = document.createElement('iframe');
  iframe.allow = 'usb; autoplay; camera; microphone;';
  iframe.src = createMakeCodeURL(
    'https://makecode.microbit.org',
    args.options?.version === 'default' ? undefined : args.options?.version,
    args.options?.lang,
    args.options?.controller ?? 1,
    args.options?.queryParams
  );
  iframe.width = '100%';
  iframe.height = '100%';

  // Create and initialise an instance of MakeCodeFrameDriver.
  const driverRef = new MakeCodeFrameDriver(
    {
      initialProjects: async () => (args.project ? [args.project] : []),
      onEditorContentLoaded: (e) => console.log('editorContentLoaded', e),
      onWorkspaceLoaded: (e) => console.log('workspaceLoaded', e),
      onWorkspaceSync: (e) => console.log('workspaceSync', e),
      onWorkspaceReset: (e) => console.log('workspaceReset', e),
      onWorkspaceEvent: (e) => console.log('workspaceEvent', e),
      onWorkspaceSave: (e) => {
        console.log(e.project!.header!.id, e.project);
      },
      onTutorialEvent: (e) => console.log('tutorialEvent', e),
      ...(args.callbacks ?? {}),
    },
    () => iframe
  );

  const waitForElementLoaded = () => {
    const targetEl = document.getElementById(elementId);
    if (!targetEl) {
      window.setTimeout(waitForElementLoaded, 500);
      return;
    }
    targetEl.replaceChildren(iframe);
    driverRef.initialize();
  };
  waitForElementLoaded();

  return <StoryWrapper id={elementId} />;
};

export const MakeCodeEditorWithControlsStory: Story = {
  name: 'MakeCode Editor with controls',
  render: renderEditor,
  args: {
    options: { version: 'default', queryParams: { hideMenu: '' } },
    project: defaultMakeCodeProject,
  },
};

export const MakeCodeEditorControllerAppModeStory: Story = {
  name: 'MakeCode Editor with controller=2 mode',
  render: renderEditor,
  args: {
    options: { version: 'default', controller: 2 },
    callbacks: {
      onDownload: (download) => console.log('download', download),
      onSave: (save) => console.log('save', save),
      onBack: () => console.log('back'),
      onBackLongPress: () => console.log('back long'),
    },
  },
};
