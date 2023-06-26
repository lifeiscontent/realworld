import type { StorybookConfig } from '@storybook/nextjs';
import { startCase } from 'lodash';

function buildSection(context: string) {
  return {
    // 👇 The directory field sets the directory your stories
    directory: `../src/${context}`,
    // 👇 The titlePrefix field will generate automatic titles for your stories
    titlePrefix: startCase(context),
    // 👇 Storybook will load all files that contain the stories extension
    files: `**/*.stories.*`,
  };
}

const config: StorybookConfig = {
  stories: [buildSection('components'), buildSection('containers')],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-apollo-client',
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
