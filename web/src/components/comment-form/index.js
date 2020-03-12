import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormikSubmitButton } from '../formik-submit-button';
import { FormikStatusErrors } from '../formik-status-errors';
import * as Yup from 'yup';
import Link from 'next/link';
import gql from 'graphql-tag';

const validationSchema = Yup.object({
  articleSlug: Yup.string().required(),
  input: Yup.object({
    body: Yup.string()
      .label('Body')
      .required()
  })
});

export function CommentForm({ articleSlug, onSubmit, username, profile }) {
  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{ articleSlug: articleSlug, input: { body: '' } }}
      onSubmit={onSubmit}
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
              src={profile.imageUrl ?? '/images/smiley-cyrus.jpg'}
              className="comment-author-img"
              alt={`Image of ${username}`}
            />
            &nbsp;&nbsp;
            <Link href="/[username]" as={`/${username}`}>
              <a className="comment-author">{username}</a>
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

CommentForm.fragments = {
  viewer: gql`
    fragment CommentFormUserFragment on User {
      username
      profile {
        imageUrl
      }
    }
  `
};

CommentForm.defaultProps = {
  profile: {}
};

CommentForm.propTypes = {
  articleSlug: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({ imageUrl: PropTypes.string }),
  username: PropTypes.string.isRequired
};
