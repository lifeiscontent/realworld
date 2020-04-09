# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'userByUsername', type: :graphql do
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
        data: {
          userByUsername: {
            articlesConnection: {
              edges: []
            },
            canFollow: { value: false },
            canUnfollow: { value: false },
            canUpdate: { value: false },
            email: owner.email,
            favoriteArticlesConnection: { edges: [] },
            followersCount: owner.followers_count,
            isViewer: false,
            profile: {
              id: owner.profile.id.to_s,
              bio: owner.profile.bio,
              imageUrl: owner.profile.image_url
            },
            username: owner.username,
            viewerIsFollowing: false
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
        data: {
          userByUsername: {
            articlesConnection: {
              edges: []
            },
            canFollow: { value: true },
            canUnfollow: { value: false },
            canUpdate: { value: false },
            email: owner.email,
            favoriteArticlesConnection: { edges: [] },
            followersCount: owner.followers_count,
            isViewer: false,
            profile: {
              id: owner.profile.id.to_s,
              bio: owner.profile.bio,
              imageUrl: owner.profile.image_url
            },
            username: owner.username,
            viewerIsFollowing: false
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
        data: {
          userByUsername: {
            articlesConnection: {
              edges: []
            },
            canFollow: { value: false },
            canUnfollow: { value: true },
            canUpdate: { value: false },
            email: owner.email,
            favoriteArticlesConnection: { edges: [] },
            followersCount: owner.followers_count,
            isViewer: false,
            profile: {
              id: owner.profile.id.to_s,
              bio: owner.profile.bio,
              imageUrl: owner.profile.image_url
            },
            username: owner.username,
            viewerIsFollowing: true
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
        data: {
          userByUsername: {
            articlesConnection: {
              edges: []
            },
            canFollow: { value: false },
            canUnfollow: { value: false },
            canUpdate: { value: true },
            email: owner.email,
            favoriteArticlesConnection: { edges: [] },
            followersCount: owner.followers_count,
            isViewer: true,
            profile: {
              id: owner.profile.id.to_s,
              bio: owner.profile.bio,
              imageUrl: owner.profile.image_url
            },
            username: owner.username,
            viewerIsFollowing: false
          }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
