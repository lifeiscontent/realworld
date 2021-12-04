import React from 'react';
import { UserArticlesToggle } from '.';

const meta = {
  title: 'Tabs/UserArticlesToggle',
  component: UserArticlesToggle,
};

export default meta;

const Template = args => <UserArticlesToggle {...args} />;

export const Renders = Template.bind({});

Renders.args = {
  username: 'lifeiscontent',
};

export const MyArticlesActive = Template.bind({});

MyArticlesActive.args = {
  ...Renders.args,
};

MyArticlesActive.parameters = {
  nextRouter: {
    pathname: '/user/[username]',
  },
};

export const FavoritedArticlesActive = Template.bind({});

FavoritedArticlesActive.args = {
  ...Renders.args,
};

FavoritedArticlesActive.parameters = {
  nextRouter: {
    pathname: '/user/[username]/favorites',
  },
};
