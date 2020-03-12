import React from 'react';
import { ArticleUpdateButton } from '.';
import { withRouter } from '../../utils/storybook';

export default {
  title: 'ArticleUpdateButton',
  component: ArticleUpdateButton,
  decorators: [withRouter]
};

export const renders = () => <ArticleUpdateButton slug="a-simple-title" />;

export const canUpdate = () => (
  <ArticleUpdateButton canUpdate={{ value: true }} slug="a-simple-title" />
);
