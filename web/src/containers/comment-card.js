import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { format } from '../utils/date';
import Markdown from 'react-markdown';
import { DeleteCommentButton } from './delete-comment-button';

export function CommentCard(props) {
  const comment = useQuery(CommentCardQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      id: props.commentId
    }
  });

  if (comment.loading) return null;

  return (
    <div className="card">
      <div className="card-block">
        <div className="card-text">
          <Markdown source={comment.data.comment.body} />
        </div>
      </div>
      <div className="card-footer">
        <Link
          href="/[username]"
          as={`/${comment.data.comment.author.username}`}
        >
          <a className="comment-author">
            <img
              src={
                comment.data.comment.author.profile.imageUrl ??
                '/images/smiley-cyrus.jpg'
              }
              className="comment-author-img"
              alt={`Image of ${comment.data.comment.author.username}`}
            />
          </a>
        </Link>
        &nbsp;&nbsp;
        <Link
          href="/[username]"
          as={`/${comment.data.comment.author.username}`}
        >
          <a className="comment-author">
            {comment.data.comment.author.username}
          </a>
        </Link>
        <time dateTime={comment.data.comment.createdAt} className="date-posted">
          {comment.data.comment.createdAt
            ? format(new Date(comment.data.comment.createdAt), 'MMM Qo')
            : null}
        </time>
        <span className="mod-options">
          <DeleteCommentButton
            commentId={props.commentId}
            onDeleteComment={props.onDeleteComment}
          />
        </span>
      </div>
    </div>
  );
}

CommentCard.propTypes = {
  commentId: PropTypes.string.isRequired,
  onDeleteComment: PropTypes.func.isRequired
};

CommentCard.fragments = {
  comment: gql`
    fragment CommentCardCommentFragment on Comment {
      id
      body
      createdAt
      author {
        username
        profile {
          imageUrl
        }
      }
      ...DeleteCommentButtonCommentFragment
    }
    ${DeleteCommentButton.fragments.comment}
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
