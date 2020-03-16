import { action } from '@storybook/addon-actions';
import { makeDecorator } from '@storybook/addons';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';
import Router from 'next/router';

export const withRouter = makeDecorator({
  name: 'Router',
  parameterName: 'router',
  wrapper(getStory, context, settings) {
    Router.router = {
      asPath: '/',
      back() {},
      beforePopState() {},
      pageLoader: { prefetched: {} },
      pathname: '/',
      prefetch() {
        return Promise.resolve();
      },
      push(...args) {
        action('router.push')(...args);
        return Promise.resolve(true);
      },
      query: {},
      reload() {},
      replace(args) {
        action('router.replace')(...args);
        return Promise.resolve(true);
      },
      ...settings.options,
      ...settings.parameters
    };

    return getStory(context);
  }
});

export const withApolloClient = makeDecorator({
  name: 'ApolloClient',
  parameterName: 'apolloClient',
  wrapper(getStory, context, settings) {
    return (
      <MockedProvider {...settings.options} {...settings.parameters}>
        {getStory(context)}
      </MockedProvider>
    );
  }
});
