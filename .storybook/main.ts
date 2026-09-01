import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    // No onboarding checklist in the sidebar or menu.
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  core: {
    disableWhatsNewNotifications: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
export default config;
