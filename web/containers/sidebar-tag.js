import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import clsx from 'clsx';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';

export function SidebarTag(props) {
  const router = useRouter();
  const tag = useQuery(SidebarTagQuery, {
    variables: { id: props.id },
    fetchPolicy: 'cache-only'
  });
  return tag.loading ? (
    <span className="tag-pill tag-default">Loading...</span>
  ) : (
    <Link
      href={{
        pathname: router.pathname,
        query: { tagName: tag.data.tag.name }
      }}
      as={{
        pathname: router.asPath,
        query: { tagName: tag.data.tag.name }
      }}
      shallow
    >
      <a
        className={clsx('tag-pill tag-default', {
          'tag-outline': router.query.tagName !== tag.data.tag.name
        })}
      >
        {tag.data.tag.name}
      </a>
    </Link>
  );
}

SidebarTag.propTypes = {
  id: PropTypes.string.isRequired
};

SidebarTag.fragments = {
  tag: gql`
    fragment SidebarTagTagFragment on Tag {
      id
      name
    }
  `
};

const SidebarTagQuery = gql`
  query SidebarTagQuery($id: ID!) {
    tag(id: $id) {
      ...SidebarTagTagFragment
    }
  }
  ${SidebarTag.fragments.tag}
`;
