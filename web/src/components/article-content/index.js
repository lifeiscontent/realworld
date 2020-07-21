import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { gql } from '@apollo/client';

export function ArticleContent({ description, body }) {
  return (
    <div className="row article-content">
      <div className="col-md-12">
        <p>{description}</p>
        <ReactMarkdown source={body} />
      </div>
    </div>
  );
}

ArticleContent.fragments = {
  article: gql`
    fragment ArticleContentArticleFragment on Article {
      body
      description
    }
  `,
};

ArticleContent.propTypes = {
  description: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};
