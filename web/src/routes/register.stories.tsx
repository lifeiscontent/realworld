import preview from '../../.storybook/preview';
import { routes } from '../app/router';

const meta = preview.meta({
  title: 'Pages/Register',
  parameters: { router: { routes, url: '/register' } },
});

export const Default = meta.story({
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: 'Sign up' });
    await canvas.findByRole('link', { name: 'Have an account?' });
  },
});
