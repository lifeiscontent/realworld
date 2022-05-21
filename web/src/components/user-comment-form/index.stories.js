import { UserCommentForm } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: UserCommentForm,
  args: {
    username: 'lifeiscontent',
  },
  argTypes: {
    onSubmit: { action: true },
  },
};

export default meta;

export const AsGuest = {};

export const AsUser = {
  args: {
    canCreateComment: buildAuthorizationResult({ value: true }),
  },
};
