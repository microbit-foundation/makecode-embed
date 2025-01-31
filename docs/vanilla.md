---
title: VanillaJS Usage
---

# VanillaJS Usage

<a href="https://microbit-foundation.github.io/makecode-embed/" class="typedoc-ignore">This documentation is best viewed on the documentation site rather than GitHub or NPM package site.</a>

## Blocks rendering

Use {@link vanilla.createMakeCodeRenderBlocks | createMakeCodeRenderBlocks} to create a MakeCode block renderer. Initialise the renderer before calling `renderBlocks` with a {@link vanilla.RenderBlocksRequest | RenderBlocksRequest}, which includes a MakeCode project ([see examples](../src/vanilla/examples.ts)). The function will return a {@link vanilla.RenderBlocksResponse | RenderBlocksResponse}.

```js
import { createMakeCodeRenderBlocks } from "@microbit/makecode-embed/vanilla";

const renderer = createMakeCodeRenderBlocks({});
renderer.initialize();
const result = await renderer.renderBlocks({ code: defaultMakeCodeProject });

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    ${result.svg}
  </div>
`;
```

## Embed MakeCode editor

Use {@link vanilla.MakeCodeFrameDriver | MakeCodeFrameDriver} class to create a driverRef for an iframe element.

```js
import {
  Project,
  MakeCodeFrameDriver,
  createMakeCodeURL,
} from "@microbit/makecode-embed/vanilla";

// Set up an iframe element.
let iframe = document.createElement("iframe");
iframe.allow = "usb; autoplay; camera; microphone;";
iframe.src = createMakeCodeURL(
  "https://makecode.microbit.org",
  undefined,
  undefined,
  1,
  undefined
);
iframe.width = "100%";
iframe.height = "100%";

document.querySelector<HTMLDivElement>("#app")!.appendChild(iframe);

// Create and initialise an instance of MakeCodeFrameDriver.
const driverRef = new MakeCodeFrameDriver(
  {
    initialProjects: async () => [defaultMakeCodeProject],
    onEditorContentLoaded: (e) => console.log("editorContentLoaded", e),
    onWorkspaceLoaded: (e) => console.log("workspaceLoaded", e),
    onWorkspaceSync: (e) => console.log("workspaceSync", e),
    onWorkspaceReset: (e) => console.log("workspaceReset", e),
    onWorkspaceEvent: (e) => console.log("workspaceEvent", e),
    onWorkspaceSave: (e) => {
      console.log(e.project!.header!.id, e.project);
    },
    onTutorialEvent: (e) => console.log("tutorialEvent", e),
  },
  () => iframe
);
driverRef.initialize();
```
