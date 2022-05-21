import { UserUpdateButton } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: UserUpdateButton,
};

export default meta;

export const AsGuest = {};

export const CanUpdate = {};

CanUpdate.args = {
  canUpdate: buildAuthorizationResult({ value: true }),
};
