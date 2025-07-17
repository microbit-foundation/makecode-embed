import { MutableRefObject, RefObject } from 'react';
import { MakeCodeFrameDriver } from '../vanilla/makecode-frame-driver.js';
import { defaultMakeCodeProject } from '../vanilla/examples.js';
import { MakeCodeProject } from '../vanilla/pxt.js';

const toolbarRowStyle = {
  fontFamily: 'sans-serif',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
  margin: '10px 0',
} as const;

const MakeCodeToolbar = ({
  driver,
  savedProjects,
}: {
  driver: RefObject<MakeCodeFrameDriver>;
  savedProjects: MutableRefObject<Map<string, MakeCodeProject>>;
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={toolbarRowStyle}>
        <button onClick={() => driver.current!.switchJavascript()}>
          Javascript
        </button>
        <button onClick={() => driver.current!.switchBlocks()}>Blocks</button>
        <button
          onClick={async () => {
            const info = await driver.current!.info();
            console.log(info);
          }}
        >
          Info
        </button>
        <button onClick={() => driver.current!.newProject()}>
          New project
        </button>
        <button
          onClick={() =>
            driver.current!.startActivity({
              activityType: 'tutorial',
              path: 'microbit-foundation/makecode-tutorials/first-lessons/step-counter',
            })
          }
        >
          Load tutorial from GitHub
        </button>
        <button onClick={() => driver.current!.print()}>Print</button>
        <button onClick={() => driver.current!.pair()}>Pair</button>
        <button onClick={() => driver.current!.compile()}>Compile</button>
        <button onClick={() => driver.current!.saveProject()}>
          Save project
        </button>
        <button onClick={() => driver.current!.unloadProject()}>
          Unload project
        </button>
        <button
          onClick={() =>
            driver.current!.openHeader(
              [...savedProjects.current.values()][0].header!.id
            )
          }
        >
          Open header
        </button>
        <button
          onClick={() =>
            driver.current!.importProject({
              project: defaultMakeCodeProject,
            })
          }
        >
          Import project (no header)
        </button>
        <button
          onClick={async () => {
            const result = await driver.current!.shareProject({
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
            driver.current!.setLanguageRestriction('javascript-only' as const)
          }
        >
          Set language restriction
        </button>
        <button
          onClick={async () => {
            const result = await driver.current!.getToolboxCategories({
              advanced: true,
            });
            console.log(result);
          }}
        >
          Get toolbox categories
        </button>
        <button onClick={() => driver.current!.toggleDebugSloMo()}>
          Toggle debug slow mo
        </button>
        <button onClick={() => driver.current!.toggleKeyboardControls()}>
          Keyboard controls
        </button>
        <button onClick={() => driver.current!.toggleGreenScreen()}>
          Green screen
        </button>
        <button onClick={() => driver.current!.toggleHighContrast()}>
          Contrast
        </button>
        <button onClick={() => driver.current!.showThemePicker()}>Theme</button>
        <button onClick={() => driver.current!.closeFlyout()}>
          Close flyout
        </button>
      </div>
      <div style={toolbarRowStyle}>
        <button
          onClick={async () => {
            const result = await driver.current!.renderBlocks({
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
            const result = await driver.current!.renderPython({
              ts: 'basic.showNumber(42)',
            });
            console.log(result);
          }}
        >
          Render Python
        </button>
        <button
          onClick={async () => {
            const result = await driver.current!.renderXml({
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
            const result = await driver.current!.renderByBlockId({
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
      <div style={toolbarRowStyle}>
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
              driver.current!.importFile({
                filename: file.name,
                parts: [text],
              });
            }
          }}
        >
          Import file
        </button>
      </div>
      <div style={toolbarRowStyle}>
        <button onClick={() => driver.current!.startSimulator()}>
          Start simulator
        </button>
        <button onClick={() => driver.current!.stopSimulator()}>
          Stop simulator
        </button>
        <button onClick={() => driver.current!.hideSimulator()}>
          Hide simulator
        </button>
        <button
          onClick={() => {
            driver.current!.setSimulatorFullScreen(true);
          }}
        >
          Set simulator full screen
        </button>
      </div>
    </div>
  );
};

export default MakeCodeToolbar;
