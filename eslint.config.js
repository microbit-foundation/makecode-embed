import microbit from '@microbit/eslint-config/react';
import storybook from 'eslint-plugin-storybook';

export default [
  ...microbit,
  ...storybook.configs['flat/recommended'],
  {
    // Rules keyed off the React version follow whatever is installed, which is
    // 19. We publish for React >= 17.0.2, so pin to the oldest we support
    // rather than be told to adopt APIs our consumers may not have.
    settings: { 'react-x': { version: '17.0.2' } },
  },
];
