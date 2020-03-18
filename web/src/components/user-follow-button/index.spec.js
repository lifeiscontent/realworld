import { render, fireEvent, screen } from '@testing-library/react';
import { action } from '@storybook/addon-actions';
import story, { renders, canFollow, canUnfollow } from './index.stories';
import { decorateStory } from '../../utils/storybook';

jest.mock('@storybook/addon-actions');

describe('UserFollowButton', () => {
  it('is disabled with insufficient access', async () => {
    render(decorateStory(renders, story));
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onFollow when clicked', async () => {
    render(decorateStory(canFollow, story));
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(action('onFollow')).toHaveBeenCalled();
  });

  it('calls onUnfollow when clicked', async () => {
    render(decorateStory(canUnfollow, story));

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(action('onUnfollow')).toHaveBeenCalled();
  });
});
