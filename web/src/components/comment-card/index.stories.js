import { fn } from 'storybook/test';
import { CommentCard } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: CommentCard,
  args: {
    onDelete: fn(),
    author: { username: 'lifeiscontent' },
    body: 'Hello world!',
    createdAt: new Date(200, 2, 1).toISOString(),
    id: '1',
  },
};

export default meta;

export const AsGuest = {};

export const CanDelete = {};

CanDelete.args = {
  canDelete: buildAuthorizationResult({ value: true }),
};
