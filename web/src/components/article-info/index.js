import PropTypes from 'prop-types';
import Link from 'next/link';
import { format } from '../../utils/date';
import { gql } from '@apollo/client';

export function ArticleInfo({ author, createdAt }) {
  return (
    <div className="info">
      <Link href={`/user/${author.username}`} className="author">
        {author.username}
      </Link>
      <time dateTime={createdAt} className="date">
        {format(new Date(createdAt), 'MMMM Qo')}
      </time>
    </div>
  );
}

ArticleInfo.fragments = {
  article: gql`
    fragment ArticleInfoArticleFragment on Article {
      author {
        username
      }
      createdAt
    }
  `,
};

ArticleInfo.propTypes = {
  author: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  createdAt: PropTypes.string.isRequired,
};
