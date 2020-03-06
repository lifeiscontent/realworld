import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

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

ArticleContent.propTypes = {
  description: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired
};
