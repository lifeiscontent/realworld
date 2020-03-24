## Creating a `page`

2.  Add the `containers` and `components` to the page.

    1.  You might want to add a full page UI test to make sure the UI looks as you would expect.

    2.  For behavior, when a service sends you something. E.g. a router passes a query param, and that query param triggers another code path. You should mock the router, and test the code path that is executed if the router was to return the expected output. Or fallback gracefully if the router does something unexpected.

Let's write a test for the EditorPage

```js
import { render, waitFor } from '@testing-library/react';
// we use our storybook for our test fixture
import story, { renders, asUser } from './index.stories';
// we want to use a custom helper for working with storybook fixtures easier
import { decorateStory } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

jest.mock('@storybook/addon-actions');

describe('EditorPage', () => {
  // we want to test that our page component actually redirects
  // when an unauthorized user comes to view the page
  describe('when not logged in', () => {
    // here, we reset our mock after its be called in the test
    afterEach(() => {
      action('nextRouter.replace').mockClear();
    });

    it('redirects', async () => {
      render(decorateStory(renders, story));

      // since this this happens in an effect, we need to use `waitFor`.
      await waitFor(() => {
        // in storybook, we mock some parts of the router to add `action` events
        // so now in our tests, we can mock the `action`
        // and test that the router was called with the right method
        expect(action('nextRouter.replace')).toHaveBeenCalledWith(
          '/editor',
          '/',
          {
            shallow: true,
          }
        );
      });
    });
  });

  describe('when logged in', () => {
    it('does not redirect', async () => {
      render(decorateStory(asUser, story));

      await waitFor(() => {
        // we just want to make sure a user who has access doesn't get redirected as well.
        expect(action('nextRouter.replace')).not.toHaveBeenCalled();

        // we could add another test here that asserts something about the page markup
        // but that's a decision you can make.
      });
    });
  });
});
```
