import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { SidebarTag } from './sidebar-tag';

const SidebarQuery = gql`
  query SidebarQuery {
    popularTags {
      ...SidebarTagTagFragment
    }
  }
  ${SidebarTag.fragments.tag}
`;

export function Sidebar() {
  const sidebar = useQuery(SidebarQuery, {
    fetchPolicy: 'cache-only'
  });

  if (sidebar.loading) return null;

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {sidebar.data.popularTags.map(tag => (
          <SidebarTag key={tag.id} tagId={tag.id} />
        ))}
      </div>
    </div>
  );
}

Sidebar.fragments = {
  query: gql`
    fragment SidebarQueryFragment on Query {
      popularTags {
        ...SidebarTagTagFragment
      }
    }
    ${SidebarTag.fragments.tag}
  `
};
