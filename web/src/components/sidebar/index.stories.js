import React from 'react';
import { Sidebar } from '.';

const meta = {
  title: 'Main/Sidebar',
  component: Sidebar,
};

export default meta;

const Template = args => <Sidebar {...args} />;

export const Renders = Template.bind({});

export const WithTags = Template.bind({});

WithTags.args = {
  popularTags: [
    { id: '1', name: 'react' },
    { id: '2', name: 'rails' },
  ],
};

export const WithActiveTag = Template.bind({});

WithActiveTag.args = {
  popularTags: [
    { id: '1', name: 'react' },
    { id: '2', name: 'rails' },
  ],
};

WithActiveTag.parameters = {
  nextRouter: {
    query: { tagName: 'react' },
  },
};
