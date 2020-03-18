import { render, screen, fireEvent } from '@testing-library/react';
import story, { renders } from './index.stories';
import { decorateStory } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

jest.mock('@storybook/addon-actions');

describe('ArticleUpdateButton', () => {
  it('goes to link on click', async () => {
    render(decorateStory(renders, story));
    const link = await screen.findByRole('link');

    fireEvent.click(link);

    expect(action('router.push')).toHaveBeenCalledWith(
      '/user/[username]',
      '/user/lifeiscontent',
      {
        shallow: undefined
      }
    );
  });
});
