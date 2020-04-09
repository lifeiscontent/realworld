# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'unfollowUser', type: :graphql do
  let(:mutation) do
    <<-GRAPHQL
    mutation UnfollowUserMutation($username: ID!) {
      unfollowUser(username: $username) {
        user {
          username
          followersCount
        }
      }
    }
    GRAPHQL
  end
  let(:relationship) { create(:relationship, follower: create(:follower), followed: create(:followed)) }
  let(:follower) { relationship.follower }
  let(:followed) { relationship.followed }
  let(:variables) do
    {
      username: followed.username
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          unfollowUser: nil
        },
        errors: [
          {
            extensions: { code: 'UNAUTHORIZED', details: {}, fullMessages: [] },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action', path: ['unfollowUser']
          }
        ]
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is defined' do
    let(:current_user) { follower }

    let(:result) do
      {
        data: {
          unfollowUser: {
            user: {
              followersCount: followed.reload.followers_count,
              username: followed.username
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
