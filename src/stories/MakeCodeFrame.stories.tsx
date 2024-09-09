import { Meta, StoryObj } from '@storybook/react';
import { useCallback, useRef } from 'react';
import { defaultMakeCodeProject } from '../vanilla/examples.js';
import { MakeCodeFrameDriver } from '../vanilla/makecode-frame-driver.js';
import {
  default as MakeCodeFrame,
  MakeCodeFrameProps,
} from '../react/MakeCodeFrame.js';
import { Project } from '../vanilla/pxt.js';
import { controllerId } from './config.js';
import StoryWrapper from './StoryWrapper.js';

const meta: Meta<typeof MakeCodeFrame> = {
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

const EditorWithToolbarStyles = {
  actions: {
    fontFamily: 'sans-serif',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    margin: '10px 0',
  } as const,
};

const MakeCodeEditorWithControls = (
  props: Omit<MakeCodeFrameProps, 'initialProjects'>
) => {
  const savedProjects = useRef<Map<string, Project>>(new Map());
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={EditorWithToolbarStyles.actions}>
          <button onClick={() => ref.current!.switchJavascript()}>
            Javascript
          </button>
          <button onClick={() => ref.current!.switchBlocks()}>Blocks</button>
          <button
            onClick={async () => {
              const info = await ref.current!.info();
              console.log(info);
            }}
          >
            Info
          </button>
          <button onClick={() => ref.current!.newProject()}>New project</button>
          <button
            onClick={() =>
              ref.current!.startActivity({
                activityType: 'tutorial',
                path: 'microbit-foundation/makecode-tutorials/first-lessons/step-counter',
              })
            }
          >
            Load tutorial from GitHub
          </button>
          <button onClick={() => ref.current!.print()}>Print</button>
          <button onClick={() => ref.current!.pair()}>Pair</button>
          <button onClick={() => ref.current!.compile()}>Compile</button>
          <button onClick={() => ref.current!.saveProject()}>
            Save project
          </button>
          <button onClick={() => ref.current!.unloadProject()}>
            Unload project
          </button>
          <button
            onClick={() =>
              ref.current!.openHeader(
                [...savedProjects.current.values()][0].header!.id
              )
            }
          >
            Open header
          </button>
          <button
            onClick={() =>
              ref.current!.importProject({
                project: defaultMakeCodeProject,
              })
            }
          >
            Import project (no header)
          </button>
          <button
            onClick={async () => {
              const result = await ref.current!.shareProject({
                headerId: [...savedProjects.current!.values()][0].header!.id,
                projectName: 'Example project name',
              });
              console.log(result);
            }}
          >
            Share project
          </button>
          <button
            onClick={() =>
              ref.current!.setLanguageRestriction('javascript-only' as const)
            }
          >
            Set language restriction
          </button>
          <button
            onClick={async () => {
              const result = await ref.current!.getToolboxCategories({
                advanced: true,
              });
              console.log(result);
            }}
          >
            Get toolbox categories
          </button>
          <button onClick={() => ref.current!.toggleDebugSloMo()}>
            Toggle debug slow mo
          </button>
          <button onClick={() => ref.current!.toggleGreenScreen()}>
            Green screen
          </button>
          <button onClick={() => ref.current!.toggleHighContrast()}>
            Contrast
          </button>
          <button onClick={() => ref.current!.closeFlyout()}>
            Close flyout
          </button>
        </div>
        <div style={EditorWithToolbarStyles.actions}>
          <button
            onClick={async () => {
              const result = await ref.current!.renderBlocks({
                ts: 'basic.showNumber(42)',
              });
              const img = document.body.appendChild(
                document.createElement('img')
              );
              img.src = result!;
            }}
          >
            Render blocks
          </button>
          <button
            onClick={async () => {
              const result = await ref.current!.renderPython({
                ts: 'basic.showNumber(42)',
              });
              console.log(result);
            }}
          >
            Render Python
          </button>
          <button
            onClick={async () => {
              const result = await ref.current!.renderXml({
                xml: defaultMakeCodeProject.text!['main.blocks']!,
              });
              const img = document.body.appendChild(
                document.createElement('img')
              );
              img.src = result!;
            }}
          >
            Render XML
          </button>
          <button
            onClick={async () => {
              const result = await ref.current!.renderByBlockId({
                blockId: 'basic_show_icon',
              });
              const img = document.body.appendChild(
                document.createElement('img')
              );
              img.src = result!;
            }}
          >
            Render by block id
          </button>
        </div>
        <div style={EditorWithToolbarStyles.actions}>
          <label>
            File to import: <input type="file" id="importFile"></input>
          </label>
          <button
            onClick={async () => {
              const importFile = document.querySelector(
                '#importFile'
              ) as HTMLInputElement;
              const file = importFile.files?.item(0);
              if (file) {
                const data = await file.arrayBuffer();
                const text = new TextDecoder().decode(data);
                ref.current!.importFile({
                  filename: file.name,
                  parts: [text],
                });
              }
            }}
          >
            Import file
          </button>
        </div>
        <div style={EditorWithToolbarStyles.actions}>
          <button onClick={() => ref.current!.startSimulator()}>
            Start simulator
          </button>
          <button onClick={() => ref.current!.stopSimulator()}>
            Stop simulator
          </button>
          <button onClick={() => ref.current!.hideSimulator()}>
            Hide simulator
          </button>
          <button
            onClick={() => {
              ref.current!.setSimulatorFullScreen(true);
            }}
          >
            Set simulator full screen
          </button>
        </div>
      </div>
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
