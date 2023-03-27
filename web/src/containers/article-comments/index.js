import PropTypes from 'prop-types';
import { useQuery, useMutation, gql, NetworkStatus } from '@apollo/client';
import { UserCommentForm } from '../../components/user-comment-form';
import { handleValidationError } from '../../utils/graphql';
import { CommentCard } from '../../components/comment-card';

export function ArticleComments({ articleSlug }) {
  const component = useQuery(ArticleCommentsQuery, {
    variables: {
      slug: articleSlug,
    },
  });

  const [deleteComment] = useMutation(ArticleCommentsDeleteCommentMutation, {
    update(
      cache,
      {
        data: {
          deleteComment: { comment },
        },
      }
    ) {
      cache.modify({
        id: cache.identify(component.data.article),
        fields: {
          comments(existingCommentRefs = [], { readField }) {
            return existingCommentRefs.filter(
              ref => readField('id', ref) !== comment.id
            );
          },
        },
      });
    },
  });

  const [createComment] = useMutation(ArticleCommentsCreateCommentMutation, {
    update(
      cache,
      {
        data: {
          createComment: { comment },
        },
      }
    ) {
      cache.modify({
        id: cache.identify(component.data.article),
        fields: {
          comments(existingCommentRefs = [], { readField }) {
            const newCommentRef = cache.writeFragment({
              data: comment,
              fragment: CommentCard.fragments.comment,
            });
            if (
              existingCommentRefs.some(
                ref => readField('id', ref) === comment.id
              )
            ) {
              return existingCommentRefs;
            }

            return [newCommentRef, ...existingCommentRefs];
          },
        },
      });
    },
  });

  const handleSubmit = (input, { setSubmitting, setStatus, resetForm }) => {
    createComment({
      variables: {
        articleSlug,
        input,
      },
    })
      .then(() => resetForm())
      .catch(err => {
        handleValidationError(err, setStatus);
        console.error(err);
      })
      .finally(() => setSubmitting(false));
  };

  if (
    component.networkStatus === NetworkStatus.loading ||
    component.networkStatus === NetworkStatus.setVariables
  ) {
    return null;
  }

  return (
    <>
      <UserCommentForm
        canCreateComment={component.data.article.canCreateComment}
        onSubmit={handleSubmit}
        {...component.data.viewer}
      />
      {component.data.article.comments.map(comment => (
        <CommentCard key={comment.id} onDelete={deleteComment} {...comment} />
      ))}
    </>
  );
}

ArticleComments.propTypes = {
  articleSlug: PropTypes.string.isRequired,
};

ArticleComments.fragments = {
  viewer: gql`
    fragment ArticleCommentsViewerFragment on User {
      ...UserCommentFormUserFragment
    }
    ${UserCommentForm.fragments.user}
  `,
  article: gql`
    fragment ArticleCommentsArticleFragment on Article {
      ...UserCommentFormArticleFragment
      slug
      comments {
        ...CommentCardCommentFragment
      }
    }
    ${UserCommentForm.fragments.article}
    ${CommentCard.fragments.comment}
  `,
};

export const ArticleCommentsQuery = gql`
  query ArticleCommentsQuery($slug: ID!) {
    viewer {
      ...ArticleCommentsViewerFragment
    }
    article: articleBySlug(slug: $slug) {
      ...ArticleCommentsArticleFragment
    }
  }
  ${ArticleComments.fragments.viewer}
  ${ArticleComments.fragments.article}
`;

export const ArticleCommentsCreateCommentMutation = gql`
  mutation ArticleCommentsCreateCommentMutation(
    $articleSlug: ID!
    $input: CreateCommentInput!
  ) {
    createComment(articleSlug: $articleSlug, input: $input) {
      comment {
        ...CommentCardCommentFragment
      }
    }
  }
  ${CommentCard.fragments.comment}
`;

const ArticleCommentsDeleteCommentMutation = gql`
  mutation ArticleCommentsDeleteCommentMutation($id: ID!) {
    deleteComment(id: $id) {
      comment {
        ...CommentCardCommentFragment
      }
    }
  }
  ${CommentCard.fragments.comment}
`;

ArticleComments.query = ArticleCommentsQuery;
