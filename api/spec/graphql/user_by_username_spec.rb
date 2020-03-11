# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'userByUsername', type: :graphql do
  before(:each) do
    travel_to Time.zone.local(1994)
  end
  after(:each) do
    travel_back
  end

  let(:query) do
    <<-GRAPHQL
    query UserByUsernameQuery($username: ID!) {
      userByUsername(username: $username) {
        username
        email
        profile {
          id
          bio
          imageUrl
        }
        followersCount
        viewerIsFollowing
        isViewer
        articlesConnection {
          edges {
            node {
              slug
            }
          }
        }
        favoriteArticlesConnection {
          edges {
            node {
              slug
            }
          }
        }
        canUnfollow {
          value
        }
        canFollow {
          value
        }
        canUpdate {
          value
        }
      }
    }
    GRAPHQL
  end
  let(:user) { create(:user, profile: build(:profile)) }
  let(:owner) { create(:user, profile: build(:profile)) }
  let(:variables) do
    {
      username: owner.username
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'userByUsername' => {
            'articlesConnection' => {
              'edges' => []
            },
            'canFollow' => { 'value' => false },
            'canUnfollow' => { 'value' => false },
            'canUpdate' => { 'value' => false },
            'email' => 'user1@example.com',
            'favoriteArticlesConnection' => { 'edges' => [] },
            'followersCount' => 0,
            'isViewer' => false,
            'profile' => {
              'id' => '1',
              'bio' => 'There are five steps involved.',
              'imageUrl' => nil
            },
            'username' => 'user1',
            'viewerIsFollowing' => false
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is user' do
    let(:current_user) { user }
    let(:result) do
      {
        'data' => {
          'userByUsername' => {
            'articlesConnection' => {
              'edges' => []
            },
            'canFollow' => { 'value' => true },
            'canUnfollow' => { 'value' => false },
            'canUpdate' => { 'value' => false },
            'email' => 'user1@example.com',
            'favoriteArticlesConnection' => { 'edges' => [] },
            'followersCount' => 0,
            'isViewer' => false,
            'profile' => {
              'id' => '1',
              'bio' => 'There are five steps involved.',
              'imageUrl' => nil
            },
            'username' => 'user1',
            'viewerIsFollowing' => false
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is a follower' do
    let(:current_user) { create(:relationship, follower: user, followed: owner).follower }
    let(:result) do
      {
        'data' => {
          'userByUsername' => {
            'articlesConnection' => {
              'edges' => []
            },
            'canFollow' => { 'value' => false },
            'canUnfollow' => { 'value' => true },
            'canUpdate' => { 'value' => false },
            'email' => 'user1@example.com',
            'favoriteArticlesConnection' => { 'edges' => [] },
            'followersCount' => 1,
            'isViewer' => false,
            'profile' => {
              'id' => '1',
              'bio' => 'There are five steps involved.',
              'imageUrl' => nil
            },
            'username' => 'user1',
            'viewerIsFollowing' => true
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is owner' do
    let(:current_user) { owner }
    let(:result) do
      {
        'data' => {
          'userByUsername' => {
            'articlesConnection' => {
              'edges' => []
            },
            'canFollow' => { 'value' => false },
            'canUnfollow' => { 'value' => false },
            'canUpdate' => { 'value' => true },
            'email' => 'user1@example.com',
            'favoriteArticlesConnection' => { 'edges' => [] },
            'followersCount' => 0,
            'isViewer' => true,
            'profile' => {
              'id' => '1',
              'bio' => 'There are five steps involved.',
              'imageUrl' => nil
            },
            'username' => 'user1',
            'viewerIsFollowing' => false
          }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
