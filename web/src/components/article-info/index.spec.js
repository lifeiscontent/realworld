import { render, screen, fireEvent } from '@testing-library/react';
import story, { renders } from './index.stories';
import { defaultDecorateStory } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';

jest.mock('@storybook/addon-actions');

describe('ArticleUpdateButton', () => {
  it('goes to link on click', async () => {
    render(defaultDecorateStory(renders, story.decorators)());
    const link = await screen.findByRole('link');

    fireEvent.click(link);

    expect(action('router.push')).toHaveBeenCalledWith(
      '/[username]',
      '/lifeiscontent',
      {
        shallow: undefined
      }
    );
  });
});
