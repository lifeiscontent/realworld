import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { Button, ButtonLink } from './Button';

const meta = preview.meta({
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: { variant: 'primary' as const, children: 'Publish Article' },
});

export const Primary = meta.story({
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Publish Article' });
    await expect(button).toHaveClass('btn', 'btn-primary');
    await expect(button).toHaveAttribute('type', 'button');
  },
});

/** An outline button has a border and no fill. */
export const Outline = meta.story({
  args: { variant: 'secondary', outline: true, size: 'sm', children: 'Follow' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toHaveClass(
      'btn-sm',
      'btn-outline-secondary'
    );
  },
});

/** A link with the same styles. */
export const Link = meta.story({
  render: () => (
    <ButtonLink variant="secondary" outline size="sm" to="/settings">
      Edit Profile Settings
    </ButtonLink>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link')).toHaveClass(
      'btn',
      'btn-outline-secondary'
    );
  },
});
