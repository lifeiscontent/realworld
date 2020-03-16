## Creating a `ui` component

a `ui` component is for displaying UI within an application.

1.  Add a UI Test in Storybook
    1. if there are any actions, test them in jest / react-testing-library.

We'll use the `ArticleFavoriteButton` as an example.

```jsx
import React from 'react';
import { ArticleFavoriteButton } from '.'; // import our UI Component
import { action } from '@storybook/addon-actions'; // import some addons

export default {
  title: 'Buttons/ArticleFavoriteButton', // the title of our story
  component: ArticleFavoriteButton // the component we're viewing
};

// the minimum number of props needed to get the component to render.
// the name `renders` comes from a test, e.g. `it('renders', () => { ... })`
// this will be visualized in storybook as ArticleFavoriteButton -> Renders
export const renders = () => (
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
export const canFavorite = () => (
  <ArticleFavoriteButton
    onFavorite={action('onFavorite')}
    onUnfavorite={action('onUnfavorite')}
    slug="a-simple-title"
    canFavorite={{ value: true }}
  />
);

export const canUnfavorite = () => (
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

since we have 2 handlers we can test them in jest, let's do that now.

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { action } from '@storybook/addon-actions';

// we can reuse our storybook examples as fixtures
import { renders, canFavorite, canUnfavorite } from './index.stories';

// in order to test that our storybook actions get called, we can mock it.
// checkout the `__mocks__` folder for more details.
jest.mock('@storybook/addon-actions');

describe('ArticleFavoriteButton', () => {
  it('is disabled with insufficient access', async () => {
    render(renders());

    const button = await screen.findByText('Favorite Article (0)');
    expect(button).toHaveAttribute('disabled');
  });

  it('calls onFavorite when clicked', async () => {
    render(canFavorite());
    const button = await screen.findByText('Favorite Article (0)');

    fireEvent.click(button);
    expect(action('onFavorite')).toHaveBeenCalled();
  });

  it('calls onUnfavorite when clicked', async () => {
    render(canUnfavorite());

    const button = await screen.findByText('Unfavorite Article (1)');

    fireEvent.click(button);
    expect(action('onUnfavorite')).toHaveBeenCalled();
  });
});
```
