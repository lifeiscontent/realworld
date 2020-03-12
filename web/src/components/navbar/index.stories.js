import React from 'react';
import { Navbar } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'Main/Navbar',
  component: Navbar,
  decorators: [withRouter]
};

export const renders = () => <Navbar />;

export const loggedIn = () => <Navbar userUsername="lifeiscontent" />;

renders.story = {
  parameters: {
    router: {
      pathname: '/'
    }
  }
};
