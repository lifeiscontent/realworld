import React from 'react';
import { Navbar } from '.';

export default {
  title: 'Main/Navbar',
  component: Navbar,
};

export const renders = () => <Navbar />;

export const loggedIn = () => <Navbar username="lifeiscontent" />;

renders.parameters = {
  nextRouter: {
    pathname: '/',
  },
};
