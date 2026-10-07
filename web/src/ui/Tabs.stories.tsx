import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { Tabs } from './Tabs';

const meta = preview.meta({
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    className: 'feed-toggle',
    tabs: [
      { label: 'Your Feed', to: '/?feed=following', active: false },
      { label: 'Global Feed', to: '/', active: true },
    ],
  },
});

/** The active tab has the active style and aria-current. */
export const Default = meta.story({
  play: async ({ canvas }) => {
    const active = canvas.getByRole('link', { name: 'Global Feed' });
    await expect(active).toHaveClass('active');
    await expect(active).toHaveAttribute('aria-current', 'page');
    await expect(
      canvas.getByRole('link', { name: 'Your Feed' })
    ).not.toHaveAttribute('aria-current');
  },
});
