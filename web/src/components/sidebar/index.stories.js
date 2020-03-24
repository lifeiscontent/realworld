import React from 'react';
import { Sidebar } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Main/Sidebar',
  component: Sidebar,
  decorators: [withNextRouter],
};

export const renders = () => <Sidebar />;

renders.story = {
  parameters: {
    router: {
      pathname: '/',
    },
  },
};

export const withTags = () => (
  <Sidebar
    popularTags={[
      { id: '1', name: 'react' },
      { id: '2', name: 'rails' },
    ]}
  />
);

withTags.story = {
  parameters: {
    router: {
      pathname: '/',
    },
  },
};

export const withActiveTag = () => (
  <Sidebar
    popularTags={[
      { id: '1', name: 'react' },
      { id: '2', name: 'rails' },
    ]}
  />
);

withActiveTag.story = {
  parameters: {
    router: {
      pathname: '/',
      asPath: '/',
      query: { tagName: 'react' },
    },
  },
};
