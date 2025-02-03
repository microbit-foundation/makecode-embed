import { Meta, StoryObj } from '@storybook/react';
import { ReactNode, useState } from 'react';
import MakeCodeBlocksRendering from '../../react/MakeCodeBlocksRendering.js';
import { MakeCodeRenderBlocksProvider } from '../../react/MakeCodeRenderBlocksProvider.js';
import { BlockLayout, Project } from '../../vanilla/pxt.js';
import {
  initialProject,
  project,
  projectWithCustomBlock,
  projectWithDatalogging,
  projectWithExtensionBlock,
  projectWithLayout,
  projectWithMelody,
  projectWithTwoExtensions,
  projectWithUserLayout,
  strawbeesExample,
} from '../fixtures.js';

const meta: Meta<typeof MakeCodeRenderBlocksProvider> = {
  title: 'stories/React/MakeCodeBlocksRendering',
  component: MakeCodeRenderBlocksProvider,
  argTypes: {
    version: {
      options: ['default', 'beta'],
      defaultValue: 'default',
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

const adaptStorybookVersion = (
  version: string | undefined
): string | undefined => {
  return version && version !== 'default' ? version : undefined;
};

export const Simple: Story = {
  render: ({ version }) => {
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={project.text!['main.ts']} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const XML: Story = {
  render: ({ version }) => {
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={projectWithLayout} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const Published: Story = {
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering packageId="_iHY3J9371HLf" />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const Melody: Story = {
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={projectWithMelody} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const ExtensionBlockSingle: Story = {
  name: 'Extension block (single)',
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={projectWithExtensionBlock} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const ExtensionBlockTwo: Story = {
  name: 'Extension block (two different)',
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={projectWithTwoExtensions} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const ExtensionBlockStrawbees: Story = {
  name: 'Extension block (Strawbees - spaces in name)',
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={strawbeesExample} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const ExtensionBlockDatalogging: Story = {
  name: 'Extension block (Datalogging)',
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={projectWithDatalogging} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const CustomBlock: Story = {
  name: 'Custom block',
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
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
        <MakeCodeRenderBlocksProvider version="intentional-404">
          <MakeCodeBlocksRendering code={project.text!['main.ts']} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const Robust: Story = {
  name: 'Robust against invalid/empty project',
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={{} as Project} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const InitialBlankProject: Story = {
  name: 'Initial blank project',
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code={initialProject} />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const EmptyString: Story = {
  name: 'Empty string',
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering code="" />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};

export const EmptyToBlocksTransition: Story = {
  name: 'Empty to blocks transition',
  render: (args) => {
    const { version } = args;
    const [project, setProject] = useState<Project>(initialProject);
    return (
      <StoryWrapper key={version}>
        <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
          <MakeCodeRenderBlocksProvider
            version={adaptStorybookVersion(version)}
          >
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
    const { version } = args;
    return (
      <StoryWrapper key={version}>
        <MakeCodeRenderBlocksProvider version={adaptStorybookVersion(version)}>
          <MakeCodeBlocksRendering
            code={projectWithUserLayout}
            layout={BlockLayout.Clean}
          />
        </MakeCodeRenderBlocksProvider>
      </StoryWrapper>
    );
  },
};
