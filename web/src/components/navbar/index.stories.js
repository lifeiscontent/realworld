import React from 'react';
import { Navbar } from '.';

const meta = {
  title: 'Main/Navbar',
  component: Navbar,
};

export default meta;

const Template = args => <Navbar {...args} />;

export const Renders = Template.bind({});

export const LoggedIn = Template.bind({});

LoggedIn.args = {
  username: 'lifeiscontent',
};
