import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { SidebarTag } from "./sidebar-tag";

const SidebarQuery = gql`
  query SidebarQuery {
    popularTags {
      ...SidebarTagTagFragment
    }
  }
  ${SidebarTag.fragments.tag}
`;

export function Sidebar(props) {
  const sidebar = useQuery(SidebarQuery);
  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {sidebar.loading ? (
          <a href="#" className="tag-pill">
            Loading...
          </a>
        ) : (
          sidebar.data.popularTags.map(tag => (
            <SidebarTag key={tag.id} id={tag.id} />
          ))
        )}
      </div>
    </div>
  );
}
