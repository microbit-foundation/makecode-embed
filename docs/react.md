---
title: React Usage
---

# React Usage

<a href="https://microbit-foundation.github.io/makecode-embed/" class="typedoc-ignore">This documentation is best viewed on the documentation site rather than GitHub or NPM package site.</a>

## Blocks rendering

Use {@link react.MakeCodeRenderBlocksProvider | MakeCodeRenderBlocksProvider} and {@link react.MakeCodeBlocksRendering | MakeCodeBlocksRendering} React components to render MakeCode blocks for a MakeCode project. Example MakeCode projects used for the demo are defined in [fixtures.ts](../src/stories/fixtures.ts).

```js
import {
  MakeCodeRenderBlocksProvider,
  MakeCodeBlocksRendering,
} from '@microbit/makecode-embed/react';

<MakeCodeRenderBlocksProvider options={options}>
  <MakeCodeBlocksRendering code={project} />
</MakeCodeRenderBlocksProvider>;
```

For more examples, take a look at the [MakeCode blocks rendering demo source code](../src/stories/react/MakeCodeBlocksRendering.stories.tsx).

## Embed MakeCode editor

Use {@link react.MakeCodeFrame | MakeCodeFrame} component to embed MakeCode.

```js
import { MakeCodeFrame } from '@microbit/makecode-embed/react';

<MakeCodeFrame
  ref={ref}
  controller={1}
  controllerId="YOUR APP NAME HERE"
  initialProjects={[savedProject]}
  onEditorContentLoaded={(e) => console.log("MakeCode is now ready")},
  onWorkspaceSave={(e) => {
    // Set project as project changes in the editor.
    setSavedProject(e.project);
  }}
/>;
```

For more examples, take a look at the [MakeCode frame demo source code](../src/stories/react/MakeCodeFrame.stories.tsx).
