import { href, useFetcher } from 'react-router';

import { type ActionResult, errorsOf } from '../../lib/forms';
import { Button } from '../../ui/Button';
import { ErrorMessages } from '../../ui/ErrorMessages';

interface FavoriteButtonProps {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
  /** "preview" shows only the count, "article" shows the text and the count. */
  variant: 'preview' | 'article';
}

/**
 * Posts to /article/:slug/favorite: POST favorites, DELETE unfavorites, like
 * the RealWorld API.
 */
export function FavoriteButton({
  slug,
  favorited,
  favoritesCount,
  variant,
}: FavoriteButtonProps) {
  const fetcher = useFetcher<ActionResult>();
  const preview = variant === 'preview';

  return (
    <fetcher.Form
      method={favorited ? 'delete' : 'post'}
      action={href('/article/:slug/favorite', { slug })}
      className={preview ? 'pull-xs-right' : undefined}
      style={{ display: 'inline' }}
    >
      <Button
        type="submit"
        variant="primary"
        outline={!favorited}
        size="sm"
        aria-pressed={favorited}
        aria-label={
          preview
            ? `${favorited ? 'Unfavorite' : 'Favorite'} article, ${favoritesCount}`
            : undefined
        }
      >
        <i className="ion-heart" />
        {preview ? (
          <> {favoritesCount}</>
        ) : (
          <>
            &nbsp; {favorited ? 'Unfavorite' : 'Favorite'} Article{' '}
            <span className="counter">({favoritesCount})</span>
          </>
        )}
      </Button>
      <ErrorMessages messages={errorsOf(fetcher.data)} />
    </fetcher.Form>
  );
}
