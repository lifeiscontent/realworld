## Creating a `ui` component

a `ui` component is for displaying UI within an application.

In React, the way you should think of UI Components is a bit different than other frameworks.
In the community, you'll hear the term "UI as a function of State" when talking about React UI Components.

Let's break down what that means.

when writing UI in HTML, you might do something like this:

```html
<button class="btn btn-sm btn-primary">Favorite Button</button>
```

what is interesting about the component model is you can hide the implementation detail of how a component makes itself look like a button.

if you don't expose properties like `style` or `className` to the react component, you can guarantee the style will be deterministic which makes it safe for refactoring later if you need to. Let take a look at what this might look like.

```jsx
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export function Button({ children, size, variant }) {
  return (
    <button
      className={clsx('btn', {
        'btn-sm': size === 'sm',
        'btn-lg': size === 'lg',
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
      })}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  size: PropTypes.oneOf(['sm', 'lg']).isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
};

const Example = () => (
  // specify options to "style" the component
  <Button size="sm" variant="primary">
    Hello World
  </Button>
);
```

This is cool! We now have guarantees about how our UI Component works, to use this component we must specify size and a variant and if we ever decide to change the way the style works, it's isolated at the component level, so whenever we use it in our application we can use the component freely without worrying about it breaking in many different places.

Let try creating the `ArticleFavoriteButton` in the example app.

This will serve as our starting template

[web/src/components/article-favorite-button/index.js][web/src/components/article-favorite-button/index.js]

```jsx
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { gql } from '@apollo/client';

export function ArticleFavoriteButton() {}
```

next, let's define the HTML template

```jsx
// ...
export function ArticleFavoriteButton() {
  return (
    <button className="btn btn-sm btn-outline-primary">
      <i className="ion-heart" /> Favorite Article (0)
    </button>
  );
}
```

next, we need to add our props for changing the functionality of the button.

```jsx
// ...
export function ArticleFavoriteButton({
  canFavorite,
  canUnfavorite,
  favoritesCount,
  onFavorite,
  onUnfavorite,
  slug,
  viewerDidFavorite,
}) {
  const disabled = !(canUnfavorite.value || canFavorite.value);
  const handleClick = event => {
    event.preventDefault();
    if (viewerDidFavorite) {
      onUnfavorite({ variables: { slug } });
    } else {
      onFavorite({ variables: { slug } });
    }
  };

  return (
    <button
      className={clsx('btn btn-sm', {
        'btn-outline-primary': viewerDidFavorite === false,
        'btn-primary': viewerDidFavorite,
      })}
      disabled={disabled}
      onClick={handleClick}
    >
      <i className="ion-heart" />{' '}
      {viewerDidFavorite ? 'Unfavorite Article' : 'Favorite Article'} (
      {favoritesCount})
    </button>
  );
}
```

We've added a couple of props, let me explain what each one does.

- canFavorite: this is an object that comes back from GraphQL called the AuthorizationResult which comes in the form of `{value: boolean}`
- canUnfavorite: this is an object that comes back from GraphQL called the AuthorizationResult which comes in the form of `{value: boolean}`
- favoritesCount: this is a number that represents how many times the article has been favorited.
- onFavorite: this is the function that will be used to call the mutation for creating the favorite.
- onUnfavorite: this is the function that will be used to call the mutation for deleting the favorite.
- slug: this is the slug for the article that will be favorited.
- viewerDidFavorite: this is a boolean for if the person viewing the article favorited it.

Let's define the `fragments`, `propTypes` and `defaultProps` to make working with the component as a developer a bit easier.

```jsx
// ...
ArticleFavoriteButton.fragments = {
  article: gql`
    fragment ArticleFavoriteButtonArticleFragment on Article {
      canFavorite {
        value
      }
      canUnfavorite {
        value
      }
      favoritesCount
      slug
      viewerDidFavorite
    }
  `,
};

ArticleFavoriteButton.defaultProps = {
  canFavorite: { value: false },
  canUnfavorite: { value: false },
  favoritesCount: 0,
  viewerDidFavorite: false,
};

ArticleFavoriteButton.propTypes = {
  canFavorite: PropTypes.shape({ value: PropTypes.bool }),
  canUnfavorite: PropTypes.shape({ value: PropTypes.bool }),
  favoritesCount: PropTypes.number,
  onFavorite: PropTypes.func.isRequired,
  onUnfavorite: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  viewerDidFavorite: PropTypes.bool,
};
```

1. we specified our `fragments` to specify our data dependencies for the component within GraphQL.
2. we specified our `defaultProps` to fallback to some reasonable values if some props are missing.
3. we specified our `propTypes` to make sure during development software engineers are using the component correctly.

as you can see, nothing about this UI Component talks about `style` or `className` which allows us to make sure our UI is deterministic.

Our UI Component is finished, but let's add some tests to make sure it doesn't break in the future.

1.  Add a UI Test in Storybook
    1. if there are any actions, test them in storybook.

We'll use the `ArticleFavoriteButton` as an example.

[web/src/components/article-favorite-button/index.stories.js][web/src/components/article-favorite-button/index.stories.js]

```jsx
import * as React from 'react';
import { ArticleFavoriteButton } from '.'; // import our UI Component
import { action } from '@storybook/addon-actions'; // import some addons

const meta = {
  title: 'Buttons/ArticleFavoriteButton', // the title of our story
  component: ArticleFavoriteButton, // the component we're viewing
};

export default meta;

// the minimum number of props needed to get the component to render.
// the name `renders` comes from a test, e.g. `it('renders', () => { ... })`
// this will be visualized in storybook as ArticleFavoriteButton -> Renders
export const Renders = () => (
  <ArticleFavoriteButton
    onFavorite={action('onFavorite')} // the action addon allows us to
    onUnfavorite={action('onUnfavorite')} // test handlers and inspect arguments in react
    slug="a-simple-title"
  />
);
```

we can also add all of the variations of our UI elements

```jsx
// ...
export const CanFavorite = () => (
  <ArticleFavoriteButton
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
    slug="a-simple-title"
    canFavorite={{ value: true }}
  />
);

export const CanUnfavorite = () => (
  <ArticleFavoriteButton
    canUnfavorite={{ value: true }}
    favoritesCount={1}
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
    slug="a-simple-title"
    viewerDidFavorite={true}
  />
);
```

since we have 2 actions (favorite/unfavorite) we can test them in storybook, let's do that now.

[web/src/components/article-favorite-button/index.stories.js][web/src/components/article-favorite-button/index.stories.js]

```jsx
import { userEvent, within, expect } from '@storybook/test';
import { ArticleFavoriteButton } from '.';
import { buildAuthorizationResult } from '../../utils/storybook';

const meta = {
  component: ArticleFavoriteButton,
  args: {
    slug: 'a-simple-title',
  },
  argTypes: {
    onFavorite: { action: true },
    onUnfavorite: { action: true },
  },
};

export default meta;

export const AsGuest = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button'));

    await expect(args.onFavorite).not.toHaveBeenCalled();
  },
};

export const AsUserWhoHasNotFavorited = {
  args: {
    canFavorite: buildAuthorizationResult({ value: true }),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button'));

    await expect(args.onFavorite).toHaveBeenCalled();
  },
};

export const AsUserWhoHasFavorited = {
  args: {
    canUnfavorite: buildAuthorizationResult({ value: true }),
    favoritesCount: 1,
    viewerDidFavorite: buildAuthorizationResult({ value: true }),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button'));

    await expect(args.onUnfavorite).toHaveBeenCalled();
  },
};
```

[web/src/components/article-favorite-button/index.js]: https://github.com/lifeiscontent/realworld/blob/master/web/src/components/article-favorite-button/index.js
[web/src/components/article-favorite-button/index.stories.js]: https://github.com/lifeiscontent/realworld/blob/master/web/src/components/article-favorite-button/index.stories.js
[web/src/components/article-favorite-button/index.stories.js]: https://github.com/lifeiscontent/realworld/blob/master/web/src/components/article-favorite-button/index.stories.js
