import microbit from '@microbit/eslint-config/react';
import storybook from 'eslint-plugin-storybook';

export default [...microbit, ...storybook.configs['flat/recommended']];
