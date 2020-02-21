import React from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { format } from "../utils/date";
import Markdown from "react-markdown";

export function Comment(props) {
  const comment = useQuery(CommentQuery, {
    variables: {
      id: props.id
    }
  });
  return (
    <div className="card" key={comment.data.comment.id}>
      <div className="card-block">
        <div className="card-text">
          <Markdown source={comment.data.comment.body} />
        </div>
      </div>
      <div className="card-footer">
        <Link
          href="/[username]"
          as={`/${comment.data.comment.author.username}`}
          shallow
        >
          <a className="comment-author">
            <img
              src={
                comment.data.comment.author.imageUrl ??
                "/images/smiley-cyrus.jpg"
              }
              className="comment-author-img"
            />
          </a>
        </Link>
        &nbsp;
        <Link
          href="/[username]"
          as={`/${comment.data.comment.author.username}`}
          shallow
        >
          <a className="comment-author">
            {comment.data.comment.author.username}
          </a>
        </Link>
        <time dateTime={comment.data.comment.createdAt} className="date-posted">
          {format(new Date(comment.data.comment.createdAt), "MMM Qo")}
        </time>
        <span className="mod-options">
          <i className="ion-edit" />
          <i className="ion-trash-a" />
        </span>
      </div>
    </div>
  );
}

Comment.fragments = {
  comment: gql`
    fragment CommentCommentFragment on Comment {
      id
      body
      createdAt
      author {
        id
        imageUrl
        username
      }
    }
  `
};

const CommentQuery = gql`
  query CommentQuery($id: ID!) {
    comment(id: $id) {
      ...CommentCommentFragment
    }
  }
  ${Comment.fragments.comment}
`;
