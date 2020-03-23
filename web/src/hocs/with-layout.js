import React from 'react';
import { Layout } from '../containers/layout';

export const withLayout = Component => props => (
  <Layout>
    <Component {...props} />
  </Layout>
);
