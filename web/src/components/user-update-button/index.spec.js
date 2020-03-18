import { render, fireEvent, screen } from '@testing-library/react';
import story, { renders, canUpdate } from './index.stories';
import { defaultDecorateStory } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';

jest.mock('@storybook/addon-actions');

describe('UserUpdateButton', () => {
  it('does not render with insufficient access', () => {
    render(defaultDecorateStory(renders, story.decorators)());

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('goes to link on click', async () => {
    render(defaultDecorateStory(canUpdate, story.decorators)());
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(action('router.push')).toHaveBeenCalledWith(
      '/settings',
      '/settings',
      {
        shallow: undefined
      }
    );
  });
});
