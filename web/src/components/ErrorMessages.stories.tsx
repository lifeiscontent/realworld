import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { ErrorMessages } from './ErrorMessages';

const meta = preview.meta({
  title: 'Components/ErrorMessages',
  component: ErrorMessages,
  tags: ['autodocs'],
  args: { messages: ["email can't be blank", 'password is too short'] },
});

/** Screen readers announce the messages. */
export const Default = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      "email can't be blank"
    );
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
  },
});

/** Without messages, nothing shows. */
export const None = meta.story({
  args: { messages: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
});
