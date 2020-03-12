import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import clsx from 'clsx';

export function Sidebar({ popularTags }) {
  const router = useRouter();

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      {popularTags.length > 0 ? (
        <div className="tag-list">
          {popularTags.map(tag => (
            <Link
              href={{ pathname: router.pathname, query: { tagName: tag.name } }}
              key={tag.id}
            >
              <a
                className={clsx('tag-pill tag-default', {
                  'tag-outline': router.query.tagName !== tag.name
                })}
              >
                {tag.name}
              </a>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

Sidebar.fragments = {
  query: gql`
    fragment SidebarQueryFragment on Query {
      popularTags {
        id
        name
      }
    }
  `
};

Sidebar.defaultProps = {
  popularTags: []
};

Sidebar.propTypes = {
  popularTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  )
};
