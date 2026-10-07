import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { TextArea, TextField } from './TextField';

const meta = preview.meta({
  title: 'UI/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Email', name: 'email' },
});

/** The label is the placeholder and the accessible name. */
export const Default = meta.story({
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(input).toHaveAttribute('placeholder', 'Email');
    await expect(input).toHaveClass('form-control');
  },
});

export const Large = meta.story({
  args: { size: 'lg' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toHaveClass('form-control-lg');
  },
});

export const MultiLine = meta.story({
  render: () => <TextArea label="Short bio about you" name="bio" />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Short bio about you' })
    ).toHaveAttribute('rows', '8');
  },
});
