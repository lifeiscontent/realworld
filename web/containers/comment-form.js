import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormikSubmitButton, FormikStatusErrors } from '../components';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CommentCard } from './comment-card';
import Link from 'next/link';

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
      id: props.userId
    }
  });

  const [createComment] = useMutation(CommentFormCreateCommentMutation, {
    update: props.onCreateComment
  });

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
            if (res.data.createComment.errors.length) {
              setStatus(res.data.createComment.errors);
            } else {
              resetForm();
            }
          })
          .catch(err => {
            console.error(err);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      <>
        <ul className="error-messages">
          <ErrorMessage component="li" name="input.body" />
          <FormikStatusErrors />
        </ul>
        <Form className="card comment-form">
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
            />
            &nbsp;&nbsp;
            <Link
              href="/[username]"
              as={`/${commentForm.data.user.profile.username}`}
            >
              <a className="comment-author">
                {commentForm.data.user.profile.username}
              </a>
            </Link>
            <FormikSubmitButton className="btn btn-sm btn-primary">
              Post Comment
            </FormikSubmitButton>
          </div>
        </Form>
      </>
    </Formik>
  );
}

CommentForm.propTypes = {
  articleSlug: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  onCreateComment: PropTypes.func.isRequired
};

CommentForm.fragments = {
  user: gql`
    fragment CommentFormUserFragment on User {
      id
      profile {
        username
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
  query CommentFormQuery($id: ID!, $slug: String!) {
    user(id: $id) {
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
      errors
      comment {
        ...CommentCardCommentFragment
      }
    }
  }
  ${CommentCard.fragments.comment}
`;
