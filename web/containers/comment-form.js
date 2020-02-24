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
    variables: {
      slug: props.slug
    },
    skip: typeof props.slug !== 'string'
  });

  const [createComment] = useMutation(CommentFormCreateCommentMutation, {
    update: props.onCreate
  });

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
        articleSlug: commentForm.data?.data?.article?.slug,
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
                commentForm.data?.viewer?.profile?.imageUrl ??
                '/images/smiley-cyrus.jpg'
              }
              className="comment-author-img"
            />
            &nbsp;&nbsp;
            <Link
              href="/[username]"
              as={`/${commentForm.data?.viewer?.profile?.username}`}
              shallow
            >
              <a className="comment-author">
                {commentForm.data?.viewer?.profile?.username}
              </a>
            </Link>
            <FormikSubmitButton
              disabled={commentForm.loading}
              className="btn btn-sm btn-primary"
            >
              Post Comment
            </FormikSubmitButton>
          </div>
        </Form>
      </>
    </Formik>
  );
}

CommentForm.propTypes = {
  slug: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired
};

const CommentFormQuery = gql`
  query CommentFormQuery($slug: String!) {
    viewer {
      id
      profile {
        username
        imageUrl
      }
    }
    article: articleBySlug(slug: $slug) {
      slug
      canCreateComment {
        value
      }
    }
  }
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
