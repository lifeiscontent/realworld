import React from 'react';
import { Sidebar } from '.';

export default {
  title: 'Main/Sidebar',
  component: Sidebar,
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
