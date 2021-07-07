import React from 'react';
import { ArticleUpdateButton } from '.';

export default {
  title: 'Buttons/ArticleUpdateButton',
  component: ArticleUpdateButton,
};

export const renders = () => <ArticleUpdateButton slug="a-simple-title" />;

export const canUpdate = () => (
  <ArticleUpdateButton canUpdate={{ value: true }} slug="a-simple-title" />
);
