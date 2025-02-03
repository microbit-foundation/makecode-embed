import { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';
import { defaultMakeCodeProject } from '../../vanilla/examples.js';
import {
  createMakeCodeURL,
  MakeCodeFrameDriver,
  Options,
} from '../../vanilla/makecode-frame-driver.js';
import { Project } from '../../vanilla/pxt.js';
import MakeCodeToolbar from '../MakeCodeToolbar.js';
import StoryWrapper from '../StoryWrapper.js';

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
  title: 'stories/VanillaJS/makeCodeFrameDriver',
};

export default meta;

type Story = StoryObj<StoryArgs>;

const renderEditor = (args: StoryArgs) => {
  const savedProjects = useRef<Map<string, Project>>(new Map());
  const ref = useRef<MakeCodeFrameDriver | null>(null);
  const cbRef = (div: HTMLElement | null) => {
    if (!div) {
      return;
    }
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
    div.appendChild(iframe);

    const savedProjects: Map<string, Project> = new Map();

    // Create and initialise an instance of MakeCodeFrameDriver.
    ref.current = new MakeCodeFrameDriver(
      {
        initialProjects: async () => (args.project ? [args.project] : []),
        onEditorContentLoaded: (e) => console.log('editorContentLoaded', e),
        onWorkspaceLoaded: (e) => console.log('workspaceLoaded', e),
        onWorkspaceSync: (e) => console.log('workspaceSync', e),
        onWorkspaceReset: (e) => console.log('workspaceReset', e),
        onWorkspaceEvent: (e) => console.log('workspaceEvent', e),
        onWorkspaceSave: (e) => {
          const headerId = e.project!.header!.id;
          savedProjects.set(headerId, e.project);
          console.log(savedProjects);
        },
        onTutorialEvent: (e) => console.log('tutorialEvent', e),
        ...(args.callbacks ?? {}),
      },
      () => iframe
    );

    ref.current.initialize();
  };

  return (
    <StoryWrapper>
      <MakeCodeToolbar savedProjects={savedProjects} driver={ref} />
      <div ref={cbRef} style={{ flexGrow: 1 }} />
    </StoryWrapper>
  );
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
