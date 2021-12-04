module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/addon-essentials',
    'storybook-addon-next-router',
    'storybook-addon-apollo-client',
  ],
  staticDirs: ['../public'],
  core: {
    builder: 'webpack5',
  },
};
