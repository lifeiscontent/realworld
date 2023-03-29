const startCase = require('lodash/startCase');
function buildSection(context) {
  return {
    // 👇 The directory field sets the directory your stories
    directory: `../src/${context}`,
    // 👇 The titlePrefix field will generate automatic titles for your stories
    titlePrefix: startCase(context),
    // 👇 Storybook will load all files that contain the stories extension
    files: `**/*.stories.*`,
  };
}
module.exports = {
  stories: [buildSection('components'), buildSection('containers')],
  addons: [
    '@storybook/addon-essentials',
    'storybook-addon-apollo-client',
    '@storybook/addon-interactions',
  ],
  staticDirs: ['../public'],
  features: {
    storyStoreV7: true,
    interactionsDebugger: true,
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};
