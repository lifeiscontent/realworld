import { render, fireEvent, screen } from '@testing-library/react';
import { action } from '@storybook/addon-actions';
import { renders, canFollow, canUnfollow } from './index.stories';

jest.mock('@storybook/addon-actions');

describe('UserFollowButton', () => {
  it('is disabled with insufficient access', async () => {
    render(renders());
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });

  it('calls onFollow when clicked', async () => {
    render(canFollow());
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(action('onFollow')).toHaveBeenCalled();
  });

  it('calls onUnfollow when clicked', async () => {
    render(canUnfollow());

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(action('onUnfollow')).toHaveBeenCalled();
  });
});
