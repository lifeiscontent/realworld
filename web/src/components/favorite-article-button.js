import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export function FavoriteArticleButton(props) {
  return (
    <button
      onClick={props.onClick}
      className={clsx('btn btn-sm', {
        'btn-outline-primary': props.pressed === false,
        'btn-primary': props.pressed
      })}
    >
      <i className="ion-heart" /> {props.children}
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
