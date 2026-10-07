import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { routes } from '../app/router';
import { signIn, viewer, viewerMock } from '../stories/fixtures';

const meta = preview.meta({
  title: 'Pages/Settings',
  beforeEach: signIn,
  parameters: {
    router: { routes, url: '/settings' },
    apolloClient: { mocks: [viewerMock] },
  },
});

/** The form shows the current values of the viewer. */
export const Default = meta.story({
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole('textbox', { name: 'Your Name' })
    ).toHaveValue(viewer.username);
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveValue(
      viewer.email
    );
    await expect(
      canvas.getByRole('button', { name: 'Or click here to logout.' })
    ).toBeVisible();
  },
});
