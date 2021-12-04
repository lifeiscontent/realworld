import React from 'react';
import { UserFollowButton } from '.';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Buttons/UserFollowButton',
  component: UserFollowButton,
};

export default meta;

const Template = args => <UserFollowButton {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  onFollow: action('onFollow'),
  onUnfollow: action('onUnfollow'),
  username: 'lifeiscontent',
};

export const CanFollow = Template.bind({});

CanFollow.args = {
  ...Renders.args,
  canFollow: { value: true },
};

export const CanUnfollow = Template.bind({});

CanUnfollow.args = {
  ...Renders.args,
  canUnfollow: { value: true },
  followersCount: 1,
  viewerIsFollowing: true,
};
