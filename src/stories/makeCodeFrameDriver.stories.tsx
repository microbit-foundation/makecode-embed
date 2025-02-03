import { Meta, StoryObj } from '@storybook/react';
import {
  createMakeCodeURL,
  MakeCodeFrameDriver,
  Options,
} from '../vanilla/makecode-frame-driver.js';
import { Project } from '../vanilla/pxt.js';
import { defaultMakeCodeProject } from '../vanilla/examples.js';
import { HtmlToReactWrapper } from './HtmlToReactWrapper.js';

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

const toolbarStyles = {
  fontFamily: 'sans-serif',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
  margin: '10px 0',
} as const;

const renderEditor = (args: StoryArgs) => {
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

  const savedProjects: Map<string, Project> = new Map();

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
        const headerId = e.project!.header!.id;
        savedProjects.set(headerId, e.project);
        console.log(savedProjects);
      },
      onTutorialEvent: (e) => console.log('tutorialEvent', e),
      ...(args.callbacks ?? {}),
    },
    () => iframe
  );

  driverRef.initialize();

  return (
    <HtmlToReactWrapper htmlEl={iframe}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={toolbarStyles}>
          <button onClick={() => driverRef.switchJavascript()}>
            Javascript
          </button>
          <button onClick={() => driverRef.switchBlocks()}>Blocks</button>
          <button
            onClick={async () => {
              const info = await driverRef.info();
              console.log(info);
            }}
          >
            Info
          </button>
          <button onClick={() => driverRef.newProject()}>New project</button>
          <button
            onClick={() =>
              driverRef.startActivity({
                activityType: 'tutorial',
                path: 'microbit-foundation/makecode-tutorials/first-lessons/step-counter',
              })
            }
          >
            Load tutorial from GitHub
          </button>
          <button onClick={() => driverRef.print()}>Print</button>
          <button onClick={() => driverRef.pair()}>Pair</button>
          <button onClick={() => driverRef.compile()}>Compile</button>
          <button onClick={() => driverRef.saveProject()}>Save project</button>
          <button onClick={() => driverRef.unloadProject()}>
            Unload project
          </button>
          <button
            onClick={() =>
              driverRef.openHeader([...savedProjects.values()][0].header!.id)
            }
          >
            Open header
          </button>
          <button
            onClick={() =>
              driverRef.importProject({
                project: defaultMakeCodeProject,
              })
            }
          >
            Import project (no header)
          </button>
          <button
            onClick={async () => {
              const result = await driverRef.shareProject({
                headerId: [...savedProjects.values()][0].header!.id,
                projectName: 'Example project name',
              });
              console.log(result);
            }}
          >
            Share project
          </button>
          <button
            onClick={() =>
              driverRef.setLanguageRestriction('javascript-only' as const)
            }
          >
            Set language restriction
          </button>
          <button
            onClick={async () => {
              const result = await driverRef.getToolboxCategories({
                advanced: true,
              });
              console.log(result);
            }}
          >
            Get toolbox categories
          </button>
          <button onClick={() => driverRef.toggleDebugSloMo()}>
            Toggle debug slow mo
          </button>
          <button onClick={() => driverRef.toggleGreenScreen()}>
            Green screen
          </button>
          <button onClick={() => driverRef.toggleHighContrast()}>
            Contrast
          </button>
          <button onClick={() => driverRef.closeFlyout()}>Close flyout</button>
        </div>
        <div style={toolbarStyles}>
          <button
            onClick={async () => {
              const result = await driverRef.renderBlocks({
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
              const result = await driverRef.renderPython({
                ts: 'basic.showNumber(42)',
              });
              console.log(result);
            }}
          >
            Render Python
          </button>
          <button
            onClick={async () => {
              const result = await driverRef.renderXml({
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
              const result = await driverRef.renderByBlockId({
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
        <div style={toolbarStyles}>
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
                driverRef.importFile({
                  filename: file.name,
                  parts: [text],
                });
              }
            }}
          >
            Import file
          </button>
        </div>
        <div style={toolbarStyles}>
          <button onClick={() => driverRef.startSimulator()}>
            Start simulator
          </button>
          <button onClick={() => driverRef.stopSimulator()}>
            Stop simulator
          </button>
          <button onClick={() => driverRef.hideSimulator()}>
            Hide simulator
          </button>
          <button
            onClick={() => {
              driverRef.setSimulatorFullScreen(true);
            }}
          >
            Set simulator full screen
          </button>
        </div>
      </div>
    </HtmlToReactWrapper>
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
