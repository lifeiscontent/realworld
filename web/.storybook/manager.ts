import { addons } from '@storybook/addons';
import { startCase } from 'lodash';

addons.setConfig({
  sidebar: {
    renderLabel: ({ name }) => startCase(name),
  },
});
