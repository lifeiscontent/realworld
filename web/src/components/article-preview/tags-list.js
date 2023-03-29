import PropTypes from 'prop-types';
import { gql } from '@apollo/client';

export function ArticlePreviewTagsList({ tags = [] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="tag-list">
      {tags.map(tag => (
        <li key={tag.id} className="tag-pill tag-default">
          {tag.name}
        </li>
      ))}
    </ul>
  );
}

ArticlePreviewTagsList.fragments = {
  article: gql`
    fragment ArticlePreviewTagsListArticleFragment on Article {
      tags {
        id
        name
      }
    }
  `,
};

ArticlePreviewTagsList.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ),
};
