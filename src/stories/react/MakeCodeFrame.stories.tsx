import { Meta, StoryObj } from '@storybook/react';
import { useCallback, useRef } from 'react';
import { defaultMakeCodeProject } from '../../vanilla/examples.js';
import { MakeCodeFrameDriver } from '../../vanilla/makecode-frame-driver.js';
import {
  default as MakeCodeFrame,
  MakeCodeFrameProps,
} from '../../react/MakeCodeFrame.js';
import { MakeCodeProject } from '../../vanilla/pxt.js';
import { controllerId } from '../config.js';
import StoryWrapper from '../StoryWrapper.js';
import MakeCodeToolbar from '../MakeCodeToolbar.js';

const meta: Meta<typeof MakeCodeFrame> = {
  title: 'stories/React/MakeCodeFrame',
  component: MakeCodeFrame,
  argTypes: {
    version: {
      options: ['default', 'beta'],
      defaultValue: undefined,
      name: 'version',
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MakeCodeFrame>;

const MakeCodeEditorWithControls = (
  props: Omit<MakeCodeFrameProps, 'initialProjects'>
) => {
  const savedProjects = useRef<Map<string, MakeCodeProject>>(new Map());
  const ref = useRef<MakeCodeFrameDriver>(null);
  const initialProjects = useCallback(async () => {
    if (savedProjects.current.size === 0) {
      // Maybe we can switch to using newProject instead?
      return [defaultMakeCodeProject];
    }
    return [...savedProjects.current.values()];
  }, []);
  return (
    <>
      <MakeCodeToolbar savedProjects={savedProjects} driver={ref} />
      <MakeCodeFrame
        ref={ref}
        controller={1}
        controllerId={controllerId}
        initialProjects={initialProjects}
        onEditorContentLoaded={(e) => console.log('editorContentLoaded', e)}
        onWorkspaceLoaded={(e) => console.log('workspaceLoaded', e)}
        onWorkspaceSync={(e) => console.log('workspaceSync', e)}
        onWorkspaceReset={(e) => console.log('workspaceReset', e)}
        onWorkspaceEvent={(e) => console.log('workspaceEvent', e)}
        onWorkspaceSave={(e) => {
          savedProjects.current?.set(e.project!.header!.id, e.project);
          console.log(savedProjects.current);
        }}
        onTutorialEvent={(e) => console.log('tutorialEvent', e)}
        {...props}
      />
    </>
  );
};

export const MakeCodeEditorWithControlsStory: Story = {
  name: 'MakeCode Editor with controls',
  args: {
    version: 'default',
  },
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper>
        <MakeCodeEditorWithControls
          version={version === 'default' ? undefined : version}
          // TODO: make this an argument and perhaps a real prop
          queryParams={{ hideMenu: '' }}
        />
      </StoryWrapper>
    );
  },
};

export const MakeCodeEditorControllerAppModeStory: Story = {
  name: 'MakeCode Editor with controller=2 mode',
  args: {
    version: 'default',
  },
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper>
        <MakeCodeEditorWithControls
          controller={2}
          controllerId={controllerId}
          version={version === 'default' ? undefined : version}
          // App specific events
          onDownload={(download) => console.log('download', download)}
          onSave={(save) => console.log('save', save)}
          onBack={() => console.log('back')}
          onBackLongPress={() => console.log('back long')}
        />
      </StoryWrapper>
    );
  },
};
