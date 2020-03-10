# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'unfollowUser', type: :graphql do
  let(:query) do
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
  let(:follower) { create(:follower) }
  let(:followed) { create(:followed) }
  let(:variables) do
    {
      username: followed.username
    }
  end

  before(:each) do
    Relationship.create(follower: follower, followed: followed)
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'unfollowUser' => nil
        },
        'errors' => [
          {
            'extensions' => { 'code' => 'UNAUTHORIZED', 'details' => {}, 'fullMessages' => [] },
            'locations' => [
              { 'column' => 7, 'line' => 2 }
            ],
            'message' => 'You are not authorized to perform this action', 'path' => ['unfollowUser']
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
        'data' => {
          'unfollowUser' => {
            'user' => {
              'followersCount' => 0,
              'username' => 'user2'
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
