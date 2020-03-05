import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

export function ArticlePreviewTagList(props) {
  return props.tags.length ? (
    <ul className="tag-list">
      {props.tags.map(tag => (
        <li className="tag-pill tag-default" key={tag.id}>
          {tag.name}
        </li>
      ))}
    </ul>
  ) : null;
}

ArticlePreviewTagList.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

ArticlePreviewTagList.fragments = {
  article: gql`
    fragment ArticlePreviewTagListArticleFragment on Article {
      tags {
        id
        name
      }
    }
  `
};
