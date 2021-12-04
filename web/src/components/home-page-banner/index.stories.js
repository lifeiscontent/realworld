import React from 'react';
import { HomePageBanner } from '.';

const meta = {
  title: 'Banners/HomePageBanner',
  component: HomePageBanner,
};

export default meta;

const Template = args => <HomePageBanner {...args} />;

export const Renders = Template.bind({});
