import { Sidebar } from '.';

const meta = {
  component: Sidebar,
};

export default meta;

export const WithoutTags = {};

export const WithTags = {
  args: {
    popularTags: [
      { id: '1', name: 'react' },
      { id: '2', name: 'rails' },
    ],
  },
};

export const WithActiveTag = {
  args: {
    popularTags: [
      { id: '1', name: 'react' },
      { id: '2', name: 'rails' },
    ],
  },
  parameters: {
    nextjs: {
      router: {
        pathname: '/',
        query: { tagName: 'react' },
      },
    },
  },
};
