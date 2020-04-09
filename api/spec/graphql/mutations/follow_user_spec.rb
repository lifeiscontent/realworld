# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'followUser', type: :graphql do
  let(:mutation) do
    <<-GRAPHQL
    mutation FollowUserMutation($username: ID!) {
      followUser(username: $username) {
        user {
          username
          followersCount
        }
      }
    }
    GRAPHQL
  end
  let(:follower) { create(:follower) }
  let(:followed) { create(:followed) }
  let(:variables) do
    {
      username: followed.username
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          followUser: nil
        },
        errors: [
          {
            extensions: { code: 'UNAUTHORIZED', details: {}, fullMessages: [] },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action', path: ['followUser']
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
          followUser: {
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
