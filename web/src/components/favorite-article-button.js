import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export function FavoriteArticleButton({ onClick, pressed, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx('btn btn-sm', {
        'btn-outline-primary': pressed === false,
        'btn-primary': pressed
      })}
    >
      <i className="ion-heart" /> {children}
    </button>
  );
}

FavoriteArticleButton.defaultProps = {
  pressed: false
};

FavoriteArticleButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  pressed: PropTypes.bool
};
