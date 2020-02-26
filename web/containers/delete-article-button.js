import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';

export function DeleteArticleButton(props) {
  const router = useRouter();
  const deleteArticleButton = useQuery(DeleteArticleButtonQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      slug: props.articleSlug
    }
  });

  const [deleteArticle] = useMutation(
    DeleteArticleButtonDeleteArticleMutation,
    {
      variables: {
        slug: props.articleSlug
      }
    }
  );

  if (deleteArticleButton.loading) return null;

  const isActionable =
    deleteArticleButton.data.article.canDelete.value ?? false;

  return isActionable ? (
    <button
      className="btn btn-outline-danger btn-sm"
      onClick={() => {
        deleteArticle().then(value => {
          router.push(
            '/[username]',
            `/${value.data.deleteArticle.article.author.profile.username}`
          );
        });
      }}
    >
      <i className="ion-trash-a"></i> Delete Article
    </button>
  ) : null;
}

DeleteArticleButton.propTypes = {
  articleSlug: PropTypes.string.isRequired
};

DeleteArticleButton.fragments = {
  article: gql`
    fragment DeleteArticleButtonArticleFragment on Article {
      slug
      canDelete {
        value
      }
    }
  `
};

const DeleteArticleButtonQuery = gql`
  query DeleteArticleButtonQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...DeleteArticleButtonArticleFragment
    }
  }
  ${DeleteArticleButton.fragments.article}
`;

const DeleteArticleButtonDeleteArticleMutation = gql`
  mutation DeleteArticleButtonDeleteArticleMutation($slug: String!) {
    deleteArticle(slug: $slug) {
      article {
        slug
        author {
          id
          profile {
            username
          }
        }
      }
    }
  }
`;
