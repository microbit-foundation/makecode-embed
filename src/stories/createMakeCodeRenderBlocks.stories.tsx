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
import { HtmlToReactWrapper } from './HtmlToReactWrapper.js';

interface StoryArgs {
  options: MakeCodeRenderBlocksOptions | undefined;
  project: Project;
}

const meta: Meta<StoryArgs> = {
  title: 'stories/VanillaJS/createMakeCodeRenderBlocks',
};

export default meta;

type Story = StoryObj<StoryArgs>;

const createMakeCodeBlockHTMLElement = (args: StoryArgs): HTMLElement => {
  const renderer = createMakeCodeRenderBlocks(args.options ?? {});
  renderer.initialize();
  const div = document.createElement('div');
  renderer.renderBlocks({ code: args.project }).then((r) => {
    if (r.svg) {
      div.innerHTML = `
      <div>
        ${r.svg}
      </div>
    `;
    }
  });
  return div;
};

const renderBlocks = (args: StoryArgs) => (
  <HtmlToReactWrapper htmlEl={createMakeCodeBlockHTMLElement(args)} />
);

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
