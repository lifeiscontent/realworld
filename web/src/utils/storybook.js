import { makeDecorator } from '@storybook/addons';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';
import Router from 'next/router';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

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
      prefetch() {},
      push() {
        return Promise.resolve(true);
      },
      query: {},
      reload() {},
      replace() {
        return Promise.resolve(true);
      },
      ...settings.options,
      ...settings.parameters
    };

    return (
      <RouterContext.Provider value={Router.router}>
        {getStory(context)}
      </RouterContext.Provider>
    );
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
