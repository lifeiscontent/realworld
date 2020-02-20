import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { Tag } from "./tag";

const SidebarQuery = gql`
  query SidebarQuery {
    popularTags {
      id
      name
    }
  }
`;

export function Sidebar(props) {
  const router = useRouter();
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
          sidebar.data.popularTags.map(tag => <Tag id={tag.id} />)
        )}
      </div>
    </div>
  );
}
