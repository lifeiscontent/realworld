import React from 'react';
import { Sidebar } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Main/Sidebar',
  component: Sidebar,
  decorators: [withNextRouter],
};

export const renders = () => <Sidebar />;

renders.parameters = {
  nextRouter: {
    pathname: '/',
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

withTags.parameters = {
  nextRouter: {
    pathname: '/',
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

withActiveTag.parameters = {
  nextRouter: {
    pathname: '/',
    asPath: '/',
    query: { tagName: 'react' },
  },
};
