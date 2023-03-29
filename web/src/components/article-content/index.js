import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { gql } from '@apollo/client';

export function ArticleContent({ description, body }) {
  return (
    <div className="row article-content">
      <div className="col-md-12">
        <p>{description}</p>
        <Markdown>{body}</Markdown>
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
