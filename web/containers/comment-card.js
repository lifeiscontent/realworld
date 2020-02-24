import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { format } from '../utils/date';
import Markdown from 'react-markdown';

export function CommentCard(props) {
  const comment = useQuery(CommentCardQuery, {
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
          as={`/${comment.data.comment.author.profile.username}`}
          shallow
        >
          <a className="comment-author">
            <img
              src={
                comment.data.comment.author.profile.imageUrl ??
                '/images/smiley-cyrus.jpg'
              }
              className="comment-author-img"
            />
          </a>
        </Link>
        &nbsp;
        <Link
          href="/[username]"
          as={`/${comment.data.comment.author.profile.username}`}
          shallow
        >
          <a className="comment-author">
            {comment.data.comment.author.profile.username}
          </a>
        </Link>
        <time dateTime={comment.data.comment.createdAt} className="date-posted">
          {format(new Date(comment.data.comment.createdAt), 'MMM Qo')}
        </time>
        <span className="mod-options">
          <i className="ion-edit" />
          <i className="ion-trash-a" />
        </span>
      </div>
    </div>
  );
}

CommentCard.propTypes = {
  id: PropTypes.string.isRequired
};

CommentCard.fragments = {
  comment: gql`
    fragment CommentCardCommentFragment on Comment {
      id
      body
      createdAt
      author {
        profile {
          id
          imageUrl
          username
        }
      }
    }
  `
};

const CommentCardQuery = gql`
  query CommentQuery($id: ID!) {
    comment(id: $id) {
      ...CommentCardCommentFragment
    }
  }
  ${CommentCard.fragments.comment}
`;
