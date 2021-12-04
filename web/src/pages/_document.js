import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
            rel="stylesheet"
          />
          <link
            href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="//demo.productionready.io/main.css" />
          <link href="//fonts.googleapis.com" rel="preconnect" />
          <link href="//fonts.gstatic.com" rel="preconnect" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
