import { render, fireEvent, screen } from '@testing-library/react';
import story, { renders, canUpdate } from './index.stories';
import { action } from '@storybook/addon-actions';
import { defaultDecorateStory } from '@storybook/client-api';

jest.mock('@storybook/addon-actions');

describe('ArticleUpdateButton', () => {
  it('does not render with insufficient access', async () => {
    render(defaultDecorateStory(renders, story.decorators)());

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('goes to link on click', () => {
    render(defaultDecorateStory(canUpdate, story.decorators)());

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(action('router.push')).toHaveBeenCalledWith(
      '/editor/[slug]',
      '/editor/a-simple-title',
      { shallow: undefined }
    );
  });
});
