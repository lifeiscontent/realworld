import { render, fireEvent, wait } from '@testing-library/react';
import { action } from '@storybook/addon-actions';
import { renders, canFollow, canUnfollow } from './index.stories';

jest.mock('@storybook/addon-actions');

describe('UserFollowButton', () => {
  it('is disabled with insufficient access', async () => {
    const { getByRole } = render(renders());
    await wait(() => {
      const button = getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  it('calls onFollow when clicked', async () => {
    const { getByRole } = render(canFollow());
    await wait(() => {
      const button = getByRole('button');
      fireEvent.click(button);
      expect(action('onFollow')).toHaveBeenCalled();
    });
  });

  it('calls onUnfollow when clicked', async () => {
    const { getByRole } = render(canUnfollow());

    await wait(() => {
      const button = getByRole('button');
      fireEvent.click(button);
      expect(action('onUnfollow')).toHaveBeenCalled();
    });
  });
});
