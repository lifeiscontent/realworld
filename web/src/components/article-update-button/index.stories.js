import React from 'react';
import { ArticleUpdateButton } from '.';
import { withNextRouter } from 'storybook-addon-next-router';

export default {
  title: 'Buttons/ArticleUpdateButton',
  component: ArticleUpdateButton,
  decorators: [withNextRouter],
};

export const renders = () => <ArticleUpdateButton slug="a-simple-title" />;

export const canUpdate = () => (
  <ArticleUpdateButton canUpdate={{ value: true }} slug="a-simple-title" />
);
