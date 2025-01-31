---
title: React Usage
---

# React Usage

<a href="https://microbit-foundation.github.io/makecode-embed/" class="typedoc-ignore">This documentation is best viewed on the documentation site rather than GitHub or NPM package site.</a>

## Blocks rendering

Use {@link react.MakeCodeRenderBlocksProvider | MakeCodeRenderBlocksProvider} and {@link react.MakeCodeBlocksRendering | MakeCodeBlocksRendering} React components to render MakeCode blocks for a MakeCode project. You can see examples of projects used for the demo in [fixtures.ts](../src/stories/fixtures.ts).

```js
import {
  MakeCodeRenderBlocksProvider,
  MakeCodeBlocksRendering,
} from '@microbit/makecode-embed/react';

<MakeCodeRenderBlocksProvider options={options}>
  <MakeCodeBlocksRendering code={project} />
</MakeCodeRenderBlocksProvider>;
```

## Embed MakeCode editor

Use {@link react.MakeCodeFrame | MakeCodeFrame} component to embed MakeCode.

```js
import { MakeCodeFrame } from '@microbit/makecode-embed/react';

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
/>
```
