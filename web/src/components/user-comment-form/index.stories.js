import { fn } from 'storybook/test';
import { UserCommentForm } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: UserCommentForm,
  args: {
    onSubmit: fn(),
    username: 'lifeiscontent',
  },
};

export default meta;

export const AsGuest = {};

export const AsUser = {
  args: {
    canCreateComment: buildAuthorizationResult({ value: true }),
  },
};
