import React from 'react';
import NextApp from 'next/app';
import getShellLayout from '../layouts/shell';

class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;

    const getLayout = Component.getLayout || getShellLayout;

    return getLayout(<Component {...pageProps} />);
  }
}

export default App;
