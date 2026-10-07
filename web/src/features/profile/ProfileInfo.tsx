import { gql, type TypedDocumentNode } from '@apollo/client';
import { href } from 'react-router';

import type { ProfileInfo_ProfileFragment } from '../../types/__generated__/graphql';
import { Avatar } from '../../ui/Avatar';
import { ButtonLink } from '../../ui/Button';
import { FollowButton } from './FollowButton';

export const PROFILE_INFO_FRAGMENT: TypedDocumentNode<ProfileInfo_ProfileFragment> = gql`
  fragment ProfileInfo_profile on Profile {
    username
    bio
    image
    following
  }
`;

interface ProfileInfoProps {
  profile: ProfileInfo_ProfileFragment;
  /** The current user sees a link to the settings instead of Follow. */
  isViewer: boolean;
}

export function ProfileInfo({ profile, isViewer }: ProfileInfoProps) {
  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <Avatar
              className="user-img"
              name={profile.username}
              image={profile.image}
            />
            <h4>{profile.username}</h4>
            <p>{profile.bio}</p>
            {isViewer ? (
              <ButtonLink
                variant="secondary"
                outline
                size="sm"
                className="action-btn"
                to={href('/settings')}
              >
                <i className="ion-gear-a" />
                &nbsp; Edit Profile Settings
              </ButtonLink>
            ) : (
              <FollowButton
                className="action-btn"
                username={profile.username}
                following={profile.following}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
