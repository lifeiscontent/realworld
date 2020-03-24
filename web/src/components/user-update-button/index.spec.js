import { render, fireEvent, screen } from '@testing-library/react';
import story, { renders, canUpdate } from './index.stories';
import { decorateStory } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

jest.mock('@storybook/addon-actions');

describe('UserUpdateButton', () => {
  it('does not render with insufficient access', () => {
    render(decorateStory(renders, story));

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('goes to link on click', async () => {
    render(decorateStory(canUpdate, story));
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(action('nextRouter.push')).toHaveBeenCalledWith(
      '/settings',
      '/settings',
      {
        shallow: undefined,
      }
    );
  });
});
