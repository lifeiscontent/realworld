import React from 'react';
import { ViewerFeedToggle } from '.';

const meta = {
  title: 'Tabs/ViewerFeedToggle',
  component: ViewerFeedToggle,
};

export default meta;

const Template = args => <ViewerFeedToggle {...args} />;

export const Renders = Template.bind({});

Renders.parameters = {
  nextRouter: {
    asPath: '/',
  },
};

export const FeedEnabled = Template.bind({});

FeedEnabled.args = {
  username: 'lifeiscontent',
};

export const FeedActive = Template.bind({});

FeedActive.args = {
  ...FeedEnabled.args,
};

FeedActive.parameters = {
  nextRouter: {
    pathname: '/feed',
    asPath: '/feed',
  },
};

export const HashTagActive = Template.bind({});

HashTagActive.args = {
  ...FeedEnabled.args,
};

HashTagActive.parameters = {
  nextRouter: {
    pathname: '/',
    asPath: '/?tagName=react',
    query: { tagName: 'react' },
  },
};
