import { render, waitFor } from '@testing-library/react';
import story, { renders, asUser } from './index.stories';
import { decorateStory } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

jest.mock('@storybook/addon-actions');

describe('EditorPage', () => {
  describe('when not logged in', () => {
    afterEach(() => {
      action('nextRouter.replace').mockClear();
    });
    it('redirects', async () => {
      render(decorateStory(renders, story));

      waitFor(() => {
        expect(action('nextRouter.replace')).toHaveBeenCalledWith('/editor', '/', {
          shallow: true,
        });
      });
    });
  });

  describe('when logged in', () => {
    it('does not redirect', async () => {
      render(decorateStory(asUser, story));

      waitFor(() => {
        expect(action('nextRouter.replace')).not.toHaveBeenCalled();
      });
    });
  });
});
