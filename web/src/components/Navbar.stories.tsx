import preview from '../../.storybook/preview';
import { Navbar } from './Navbar';

const meta = preview.meta({
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  args: { viewer: null },
});

/** A guest sees the links to sign in and sign up. */
export const Guest = meta.story({
  play: async ({ canvas }) => {
    await canvas.findByRole('link', { name: 'Sign in' });
  },
});

/** A signed-in user sees the editor, the settings, and the profile. */
export const SignedIn = meta.story({
  args: { viewer: { username: 'jake', image: null } },
  play: async ({ canvas }) => {
    await canvas.findByRole('link', { name: /jake/ });
  },
});
