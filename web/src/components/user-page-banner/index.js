import PropTypes from 'prop-types';
import { UserFollowButton } from '../user-follow-button';
import { UserUpdateButton } from '../user-update-button';
import { UserAvatar } from '../user-avatar';
import { gql } from '@apollo/client';

export function UserPageBanner({
  canFollow,
  canUnfollow,
  canUpdate,
  followersCount,
  onFollow,
  onUnfollow,
  profile,
  username,
  viewerIsFollowing,
}) {
  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <UserAvatar size="128" username={username} profile={profile} />
            <h4>{username}</h4>
            {profile?.bio ? <p>{profile.bio}</p> : null}
            <div className="btn-toolbar">
              <UserFollowButton
                canFollow={canFollow}
                canUnfollow={canUnfollow}
                followersCount={followersCount}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
                username={username}
                viewerIsFollowing={viewerIsFollowing}
              />
              <UserUpdateButton canUpdate={canUpdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserPageBanner.fragments = {
  user: gql`
    fragment UserPageBannerUserFragment on User {
      username
      profile {
        bio
      }
      ...UserAvatarUserFragment
      ...UserFollowButtonUserFragment
      ...UserUpdateButtonUserFragment
    }
    ${UserAvatar.fragments.user}
    ${UserFollowButton.fragments.user}
    ${UserUpdateButton.fragments.user}
  `,
};

UserPageBanner.propTypes = {
  canFollow: PropTypes.object,
  canUnfollow: PropTypes.object,
  canUpdate: PropTypes.object,
  followersCount: PropTypes.number,
  profile: PropTypes.shape({
    bio: PropTypes.string,
  }),
  username: PropTypes.string.isRequired,
  viewerIsFollowing: PropTypes.bool,
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
};
