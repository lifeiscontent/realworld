import { gql, type TypedDocumentNode } from '@apollo/client';
import { Form, href } from 'react-router';

import type { ArticleActions_ArticleFragment } from '../../types/__generated__/graphql';
import { Button, ButtonLink } from '../../ui/Button';
import { FollowButton } from '../profile/FollowButton';
import { FavoriteButton } from './FavoriteButton';

export const ARTICLE_ACTIONS_FRAGMENT: TypedDocumentNode<ArticleActions_ArticleFragment> = gql`
  fragment ArticleActions_article on Article {
    slug
    favorited
    favoritesCount
    author {
      username
      following
    }
  }
`;

/** The author edits or deletes the article. */
export function ArticleAuthorActions({ slug }: { slug: string }) {
  return (
    <>
      <ButtonLink
        variant="secondary"
        outline
        size="sm"
        to={href('/editor/:slug?', { slug })}
      >
        <i className="ion-edit" /> Edit Article
      </ButtonLink>{' '}
      <Form
        method="delete"
        action={href('/article/:slug', { slug })}
        style={{ display: 'inline' }}
      >
        <Button type="submit" variant="danger" outline size="sm">
          <i className="ion-trash-a" /> Delete Article
        </Button>
      </Form>
    </>
  );
}

/** Other users follow the author and favorite the article. */
export function ArticleReaderActions({
  article,
}: {
  article: ArticleActions_ArticleFragment;
}) {
  return (
    <>
      <FollowButton
        username={article.author.username}
        following={article.author.following}
      />
      &nbsp;&nbsp;
      <FavoriteButton
        variant="article"
        slug={article.slug}
        favorited={article.favorited}
        favoritesCount={article.favoritesCount}
      />
    </>
  );
}
