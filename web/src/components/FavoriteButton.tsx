import { clsx } from 'clsx';
import { useFetcher } from 'react-router';
import { errorsOf, type ActionResult } from '../lib/forms';
import { ErrorMessages } from './ErrorMessages';
import { paths } from '../lib/paths';

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

  return (
    <fetcher.Form
      method={favorited ? 'delete' : 'post'}
      action={paths.articleFavorite(slug)}
      className={clsx({ 'pull-xs-right': variant === 'preview' })}
      style={{ display: 'inline' }}
    >
      <button
        type="submit"
        className={clsx('btn btn-sm', {
          'btn-outline-primary': !favorited,
          'btn-primary': favorited,
        })}
        aria-label={
          variant === 'preview'
            ? `${favorited ? 'Unfavorite' : 'Favorite'} article, ${favoritesCount}`
            : undefined
        }
        aria-pressed={favorited}
      >
        <i className="ion-heart" />
        {variant === 'preview' ? (
          <> {favoritesCount}</>
        ) : (
          <>
            &nbsp; {favorited ? 'Unfavorite' : 'Favorite'} Article{' '}
            <span className="counter">({favoritesCount})</span>
          </>
        )}
      </button>
      <ErrorMessages messages={errorsOf(fetcher.data)} />
    </fetcher.Form>
  );
}
