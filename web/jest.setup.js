// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { setGlobalConfig } from '@storybook/testing-react';
import * as globalStorybookConfig from './.storybook/preview';
import { WithApolloClient } from 'storybook-addon-apollo-client/dist/decorators';
import { WithNextRouter } from 'storybook-addon-next-router/dist/decorators';

setGlobalConfig({
  ...globalStorybookConfig,
  decorators: [
    ...globalStorybookConfig.decorators,
    WithApolloClient,
    WithNextRouter,
  ],
});
