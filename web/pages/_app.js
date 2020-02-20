import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import NextApp from "next/app";
function NavLink(props) {
  const router = useRouter();

  return (
    <Link href={props.href} as={props.as}>
      <a
        className={clsx("nav-link", {
          active: router.pathname === props.href
        })}
      >
        {props.children}
      </a>
    </Link>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Conduit</title>
        <meta charSet="utf-8" />
        <link
          href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="stylesheet" href="//demo.productionready.io/main.css" />
      </Head>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link href="/">
            <a className="navbar-brand">conduit</a>
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <NavLink href="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink href="/editor">
                <i className="ion-compose" />
                &nbsp;New Post
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink href="/settings">
                <i className="ion-gear-a" />
                &nbsp;Settings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink href="/register">Sign up</NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Component {...pageProps} />
      <footer>
        <div className="container">
          <Link href="/">
            <a className="logo-font">conduit</a>
          </Link>
          <span className="attribution">
            An interactive learning project from{" "}
            <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
App.getInitialProps = async appContext => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(appContext);

  return { ...appProps };
};
