import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormikSubmitButton } from '../formik-submit-button';
import { FormikStatusErrors } from '../formik-status-errors';
import * as Yup from 'yup';
import Link from 'next/link';
import { gql } from '@apollo/client';
import Image from 'next/image';

const validationSchema = Yup.object({
  body: Yup.string().label('Body').required(),
});

export function UserCommentForm({
  onSubmit,
  username,
  profile,
  canCreateComment,
}) {
  if (!canCreateComment?.value) return null;

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{ body: '' }}
      onSubmit={onSubmit}
    >
      <Form>
        <ul className="error-messages">
          <ErrorMessage component="li" name="body" />
          <FormikStatusErrors />
        </ul>
        <div className="card comment-form">
          <div className="card-block">
            <Field
              name="body"
              as="textarea"
              className="form-control"
              placeholder="Write a comment..."
              rows={3}
            />
          </div>
          <div className="card-footer">
            <Image
              alt={`Image of ${username}`}
              className="comment-author-img"
              height="32"
              src={profile?.imageUrl ?? '/images/smiley-cyrus.jpg'}
              unoptimized={!!profile?.imageUrl}
              priority
              width="32"
            />
            &nbsp;&nbsp;
            <Link href={`/user/${username}`} className="comment-author">
              {username}
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

UserCommentForm.fragments = {
  article: gql`
    fragment UserCommentFormArticleFragment on Article {
      canCreateComment {
        value
      }
    }
  `,
  user: gql`
    fragment UserCommentFormUserFragment on User {
      username
      profile {
        imageUrl
      }
    }
  `,
};

UserCommentForm.propTypes = {
  canCreateComment: PropTypes.shape({ value: PropTypes.bool }),
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({ imageUrl: PropTypes.string }),
  username: (props, ...rest) =>
    props.canCreateComment.value
      ? PropTypes.string.isRequired(props, ...rest)
      : PropTypes.string(props, ...rest),
};
