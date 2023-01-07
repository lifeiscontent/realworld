import { render, fireEvent, screen } from '@testing-library/react';
import { UserFollowButton } from '.';

describe('UserFollowButton', () => {
  let onFollow;
  let onUnfollow;

  beforeEach(() => {
    onFollow = jest.fn();
    onUnfollow = jest.fn();
  });

  it('is disabled with insufficient access', async () => {
    render(
      <UserFollowButton
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        username="lifeiscontent"
      />
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onFollow when clicked', async () => {
    render(
      <UserFollowButton
        canFollow={{ value: true }}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        username="lifeiscontent"
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onFollow).toHaveBeenCalled();
  });

  it('calls onUnfollow when clicked', async () => {
    render(
      <UserFollowButton
        canUnfollow={{ value: true }}
        followersCount={1}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        username="lifeiscontent"
        viewerIsFollowing
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onUnfollow).toHaveBeenCalled();
  });
});
