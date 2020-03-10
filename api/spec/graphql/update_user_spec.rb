# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'updateUser', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    mutation UpdateUserMutation($username: ID!, $input: UpdateUserInput!) {
      updateUser(username: $username, input: $input) {
        user {
          username
          email
          profile {
            bio
          }
        }
      }
    }
    GRAPHQL
  end
  let(:owner) { create(:user, profile: build(:profile)) }
  let(:variables) do
    {
      username: owner.username,
      input: {
        username: owner.username,
        email: owner.email,
        profile: {
          bio: owner.profile.bio
        }
      }
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'updateUser' => nil
        },
        'errors' => [
          {
            'extensions' => {
              'code' => 'UNAUTHORIZED',
              'details' => {},
              'fullMessages' => []
            },
            'locations' => [
              { 'column' => 7, 'line' => 2 }
            ],
            'message' => 'You are not authorized to perform this action',
            'path' => ['updateUser']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end

  context 'current_user is a user' do
    let(:current_user) { create(:user) }

    let(:result) do
      {
        'data' => {
          'updateUser' => nil
        },
        'errors' => [
          {
            'extensions' => {
              'code' => 'UNAUTHORIZED',
              'details' => {},
              'fullMessages' => []
            },
            'locations' => [
              { 'column' => 7, 'line' => 2 }
            ],
            'message' => 'You are not authorized to perform this action',
            'path' => ['updateUser']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end

  context 'current_user is owner' do
    let(:current_user) { owner }
    let(:result) do
      {
        'data' => {
          'updateUser' => {
            'user' => {
              'email' => 'user1@example.com',
              'profile' => {
                'bio' => 'There are five steps involved.'
              },
              'username' => 'user1'
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
