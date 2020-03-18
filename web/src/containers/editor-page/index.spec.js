import { render, waitFor } from '@testing-library/react';
import story, { renders, asUser } from './index.stories';
import { defaultDecorateStory } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';

jest.mock('@storybook/addon-actions');

describe('EditorPage', () => {
  describe('when not logged in', () => {
    afterEach(() => {
      action('router.replace').mockClear();
    });
    it('redirects', async () => {
      render(defaultDecorateStory(renders, story.decorators)(renders.story));

      await waitFor(() => {
        expect(action('router.replace')).toHaveBeenCalledWith('/editor', '/', {
          shallow: true
        });
      });
    });
  });

  describe('when logged in', () => {
    it('does not redirect', async () => {
      render(defaultDecorateStory(asUser, story.decorators)(asUser.story));

      await waitFor(() => {
        expect(action('router.replace')).not.toHaveBeenCalled();
      });
    });
  });
});
