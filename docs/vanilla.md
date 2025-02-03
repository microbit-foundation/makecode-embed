---
title: VanillaJS Usage
---

# VanillaJS Usage

<a href="https://microbit-foundation.github.io/makecode-embed/" class="typedoc-ignore">This documentation is best viewed on the documentation site rather than GitHub or NPM package site.</a>

## Blocks rendering

Use {@link vanilla.createMakeCodeRenderBlocks | createMakeCodeRenderBlocks} to create a MakeCode block renderer. Initialise the renderer before calling `renderBlocks` with a {@link vanilla.RenderBlocksRequest | RenderBlocksRequest}, which includes a MakeCode project ([see examples](../src/stories/fixtures.ts)). The function will return a {@link vanilla.RenderBlocksResponse | RenderBlocksResponse}.

```js
import { createMakeCodeRenderBlocks } from "@microbit/makecode-embed/vanilla";

const renderer = createMakeCodeRenderBlocks({});
renderer.initialize();
const result = await renderer.renderBlocks({ code: makeCodeProject });

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    ${result.svg}
  </div>
`;
```

For more examples, take a look at the [MakeCode blocks rendering demo source code](../src/stories/vanilla/makecode-render-blocks.stories.tsx).

## Embed MakeCode editor

Use {@link vanilla.MakeCodeFrameDriver | MakeCodeFrameDriver} class to create a driverRef for an iframe element. The iframe element src URL can be generated using {@link vanilla.createMakeCodeURL | createMakeCodeURL}.

```js
import {
  Project,
  MakeCodeFrameDriver,
  createMakeCodeURL,
} from "@microbit/makecode-embed/vanilla";

// Set up an iframe element.
const iframe = document.createElement("iframe");
iframe.allow = "usb; autoplay; camera; microphone;";
iframe.src = createMakeCodeURL(
  "https://makecode.microbit.org",
  undefined, // Version.
  undefined, // Language.
  1, // Controller.
  undefined // Query params.
);
iframe.width = "100%";
iframe.height = "100%";

document.querySelector<HTMLDivElement>("#app")!.appendChild(iframe);

// Create and initialise an instance of MakeCodeFrameDriver.
const driverRef = new MakeCodeFrameDriver(
  {
    controllerId: "YOUR APP NAME HERE",
    initialProjects: async () => [makeCodeProject],
    onEditorContentLoaded: (e) => console.log("MakeCode is now ready"),
    onWorkspaceSave: (e) => {
      console.log(e.project!.header!.id, e.project);
    },
  },
  () => iframe
);
driverRef.initialize();
```

For more examples, take a look at the [MakeCode frame demo source code](../src/stories/vanilla/makecode-frame-driver.stories.tsx).
