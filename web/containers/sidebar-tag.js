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
    fetchPolicy: 'cache-only',
    variables: { id: props.tagId }
  });

  if (tag.loading) return null;

  return (
    <Link
      href={{
        pathname: router.pathname,
        query: { tagName: tag.data.tag.name }
      }}
      as={{
        pathname: router.pathname,
        query: { tagName: tag.data.tag.name }
      }}
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
  tagId: PropTypes.string.isRequired
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
