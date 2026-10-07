import type { StorybookConfig } from '@storybook/react-vite';
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';

/** True for the plugins of @react-router/dev, which build the whole app. */
function isReactRouterPlugin(plugin: PluginOption): boolean {
  if (Array.isArray(plugin)) return plugin.some(isReactRouterPlugin);
  return (
    !!plugin &&
    typeof plugin === 'object' &&
    'name' in plugin &&
    plugin.name.startsWith('react-router')
  );
}

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
    '@chromatic-com/storybook',
    'storybook-addon-apollo-client',
  ],
  staticDirs: ['../public'],
  // Stories render route modules in a test router, so they need the React
  // plugin instead of the React Router plugin from vite.config.ts.
  viteFinal: viteConfig => {
    const plugins = (viteConfig.plugins ?? []).filter(
      plugin => !isReactRouterPlugin(plugin)
    );
    if (!process.env.VITEST) plugins.push(react());
    return { ...viteConfig, plugins };
  },
};

export default config;
