import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [{
    directory: '../src/components',
    titlePrefix: 'Components',
    files: '**/*.@(mdx|stories.*)'
  }, {
    directory: '../src/containers',
    titlePrefix: 'Containers',
    files: '**/*.@(mdx|stories.*)'
  }],

  addons: [
    '@storybook/addon-links',
    'storybook-addon-apollo-client',
    '@chromatic-com/storybook',
    '@storybook/addon-mcp',
    '@storybook/addon-docs'
  ],

  staticDirs: ['../public'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  }
};

export default config;
