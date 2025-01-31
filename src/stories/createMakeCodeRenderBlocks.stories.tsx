import { Meta, StoryObj } from '@storybook/react';
import {
  createMakeCodeRenderBlocks,
  MakeCodeRenderBlocksOptions,
} from '../vanilla/makecode-render-blocks.js';
import {
  initialProject,
  project,
  projectWithCustomBlock,
  projectWithDatalogging,
  projectWithExtensionBlock,
  projectWithLayout,
  projectWithMelody,
  projectWithTwoExtensions,
} from './fixtures.js';
import { Project } from '../vanilla/pxt.js';

interface StoryArgs {
  options: MakeCodeRenderBlocksOptions | undefined;
  project: Project;
}

const meta: Meta<StoryArgs> = {
  title: 'createMakeCodeRenderBlocks',
};

export default meta;

type Story = StoryObj<StoryArgs>;

const renderBlocks = (args: StoryArgs) => {
  const elementId = 'story-wrapper';
  const renderer = createMakeCodeRenderBlocks(args.options ?? {});
  renderer.initialize();
  const waitForElementLoaded = () => {
    const targetEl = document.getElementById(elementId);
    if (!targetEl) {
      window.setTimeout(waitForElementLoaded, 500);
      return;
    }
    renderer.renderBlocks({ code: args.project }).then((r) => {
      if (r.svg) {
        targetEl.innerHTML = `
        <div>
          ${r.svg}
        </div>
      `;
      }
    });
  };
  waitForElementLoaded();
  return <div id={elementId}></div>;
};

export const Simple: Story = {
  render: renderBlocks,
  args: { project: project },
};

export const XML: Story = {
  render: renderBlocks,
  args: { project: projectWithLayout },
};

export const Melody: Story = {
  render: renderBlocks,
  args: { project: projectWithMelody },
};

export const ExtensionBlockSingle: Story = {
  render: renderBlocks,
  args: { project: projectWithExtensionBlock },
};

export const ExtensionBlockTwo: Story = {
  render: renderBlocks,
  args: { project: projectWithTwoExtensions },
};

export const ExtensionBlockDatalogging: Story = {
  render: renderBlocks,
  args: { project: projectWithDatalogging },
};

export const CustomBlock: Story = {
  render: renderBlocks,
  args: { project: projectWithCustomBlock },
};

export const InitialBlankProject: Story = {
  render: renderBlocks,
  args: { project: initialProject },
};
