import React from 'react';
import NextApp from 'next/app';

class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}

export default App;
