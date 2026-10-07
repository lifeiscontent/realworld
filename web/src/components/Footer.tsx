import { Link } from 'react-router';

export function Footer() {
  return (
    <footer>
      <div className="container">
        <Link to="/" className="logo-font">
          conduit
        </Link>
        <span className="attribution">
          An interactive learning project. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  );
}
