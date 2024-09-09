import { Meta, StoryObj } from '@storybook/react';
import { ReactNode, useState } from 'react';
import MakeCodeBlocksRendering from '../react/MakeCodeBlocksRendering.js';
import {
  initialProject,
  project,
  projectWithDatalogging,
  projectWithExtensionBlock,
  projectWithLayout,
  projectWithCustomBlock,
  projectWithMelody,
  projectWithTwoExtensions,
  projectWithUserLayout,
  strawbeesExample,
} from './fixtures.js';
import { MakeCodeRenderBlocksProvider } from '../react/MakeCodeRenderBlocksProvider.js';
import { MakeCodeRenderBlocksOptions } from '../vanilla/makecode-render-blocks.js';
import { BlockLayout, Project } from '../vanilla/pxt.js';

const meta: Meta<typeof MakeCodeRenderBlocksProvider> = {
  component: MakeCodeRenderBlocksProvider,
  argTypes: {
    options: {
      options: ['default', 'beta'],
      defaultValue: 'default',
      name: 'version',
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MakeCodeRenderBlocksProvider>;

const StoryWrapper = (props: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 700,
    }}
  >
    {props.children}
  </div>
);

const getOptionsFromVersion = (
  version: string
): MakeCodeRenderBlocksOptions => {
  const options: MakeCodeRenderBlocksOptions = {};
  if (version && version !== 'default') {
    options['version'] = version;
  }
  return options;
};

export const InitialBlankProject: Story = {
  name: 'Initial blank project',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={initialProject} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const EmptyString: Story = {
  name: 'Empty string',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code="" />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const EmptyToBlocksTransition: Story = {
  name: 'Empty to blocks transition',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    const [project, setProject] = useState<Project>(initialProject);
    return (
      <StoryWrapper key={options.version}>
        <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
          <MakeCodeRenderBlocksProvider options={options}>
            <MakeCodeBlocksRendering code={project} />
          </MakeCodeRenderBlocksProvider>
          <div>
            <button
              onClick={() =>
                setProject(
                  project === projectWithLayout
                    ? initialProject
                    : projectWithLayout
                )
              }
            >
              Update
            </button>
          </div>
        </div>
      </StoryWrapper>
    );
  },
};

export const RespectUserLayout: Story = {
  name: 'Respect user layout',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering
            code={projectWithUserLayout}
            layout={BlockLayout.Clean}
          />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const Simple: Story = {
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={project.text!['main.ts']} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const XML: Story = {
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={projectWithLayout} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const Published: Story = {
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    console.log(options);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering packageId="_iHY3J9371HLf" />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const Melody: Story = {
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={projectWithMelody} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const ExtensionBlockSingle: Story = {
  name: 'Extension block (single)',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={projectWithExtensionBlock} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const ExtensionBlockTwo: Story = {
  name: 'Extension block (two different)',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={projectWithTwoExtensions} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const ExtensionBlockStrawbees: Story = {
  name: 'Extension block (Strawbees - spaces in name)',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={strawbeesExample} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const ExtensionBlockDatalogging: Story = {
  name: 'Extension block (Datalogging)',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={projectWithDatalogging} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const CustomBlock: Story = {
  name: 'Custom block',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={projectWithCustomBlock} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const Error: Story = {
  render: () => {
    return (
      <StoryWrapper>
        <MakeCodeRenderBlocksProvider options={{ version: 'intentional-404' }}>
          <MakeCodeBlocksRendering code={project.text!['main.ts']} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const Robust: Story = {
  name: 'Robust against invalid/empty project',
  render: (args) => {
    const { options: version } = args;
    const options = getOptionsFromVersion(version as string);
    return (
      <StoryWrapper key={options.version}>
        <MakeCodeRenderBlocksProvider options={options}>
          <MakeCodeBlocksRendering code={{} as Project} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};
