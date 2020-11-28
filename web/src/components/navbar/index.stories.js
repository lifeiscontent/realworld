import React from 'react';
import { Navbar } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Main/Navbar',
  component: Navbar,
  decorators: [withNextRouter],
};

export const renders = () => <Navbar />;

export const loggedIn = () => <Navbar username="lifeiscontent" />;

renders.parameters = {
  nextRouter: {
    pathname: '/',
  },
};
