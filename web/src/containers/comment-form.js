import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormikSubmitButton } from '../components/formik/formik-submit-button';
import { FormikStatusErrors } from '../components/formik/formik-status-errors';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CommentCard } from './comment-card';
import Link from 'next/link';
import { handleValidationError } from '../utils/graphql';

const validationSchema = Yup.object({
  articleSlug: Yup.string().required(),
  input: Yup.object({
    body: Yup.string()
      .label('Body')
      .required()
  })
});

export function CommentForm(props) {
  const commentForm = useQuery(CommentFormQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug,
      username: props.userUsername
    }
  });

  const [createComment] = useMutation(CommentFormCreateCommentMutation, {
    update: props.onCreateComment
  });

  if (commentForm.loading) return null;

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
        articleSlug: props.articleSlug,
        input: { body: '' }
      }}
      onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
        createComment({
          variables: values
        })
          .then(res => {
            resetForm();
          })
          .catch(err => {
            handleValidationError(err, setStatus);
            console.error(err);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      <Form>
        <ul className="error-messages">
          <ErrorMessage component="li" name="input.body" />
          <FormikStatusErrors />
        </ul>
        <div className="card comment-form">
          <div className="card-block">
            <Field
              name="input.body"
              as="textarea"
              className="form-control"
              placeholder="Write a comment..."
              rows={3}
            />
          </div>
          <div className="card-footer">
            <img
              src={
                commentForm.data.user.profile.imageUrl ??
                '/images/smiley-cyrus.jpg'
              }
              className="comment-author-img"
              alt={`Image of ${commentForm.data.user.username}`}
            />
            &nbsp;&nbsp;
            <Link href="/[username]" as={`/${commentForm.data.user.username}`}>
              <a className="comment-author">{commentForm.data.user.username}</a>
            </Link>
            <FormikSubmitButton className="btn btn-sm btn-primary">
              Post Comment
            </FormikSubmitButton>
          </div>
        </div>
      </Form>
    </Formik>
  );
}

CommentForm.propTypes = {
  articleSlug: PropTypes.string.isRequired,
  userUsername: PropTypes.string.isRequired,
  onCreateComment: PropTypes.func.isRequired
};

CommentForm.fragments = {
  user: gql`
    fragment CommentFormUserFragment on User {
      username
      profile {
        imageUrl
      }
    }
  `,
  article: gql`
    fragment CommentFormArticleFragment on Article {
      slug
      canCreateComment {
        value
      }
    }
  `
};

const CommentFormQuery = gql`
  query CommentFormQuery($username: ID!, $slug: String!) {
    user: userByUsername(username: $username) {
      ...CommentFormUserFragment
    }
    article: articleBySlug(slug: $slug) {
      ...CommentFormArticleFragment
    }
  }
  ${CommentForm.fragments.user}
  ${CommentForm.fragments.article}
`;

const CommentFormCreateCommentMutation = gql`
  mutation CommentFormCreateCommentMutation(
    $articleSlug: String!
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
