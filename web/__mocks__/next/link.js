import React from 'react';

export default function Link({ as, href, ...props }) {
  return React.cloneElement(React.Children.only(props.children), {
    href: as ?? href,
  });
}
