# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'createComment', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    mutation CreateCommentMutation($articleSlug: ID!, $input: CreateCommentInput!) {
      createComment(articleSlug: $articleSlug, input: $input) {
        comment {
          article {
            slug
          }
          author {
            username
          }
          body
        }
      }
    }
    GRAPHQL
  end
  let(:tags) { create_list(:tag, 3) }
  let(:article) { create(:article, author: build(:author)) }
  let(:comment_attributes) { attributes_for(:comment) }
  let(:variables) do
    {
      articleSlug: article.slug,
      input: {
        body: comment_attributes[:body]
      }
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'createComment' => nil
        },
        'errors' => [
          {
            'extensions' => { 'code' => 'UNAUTHORIZED', 'details' => {}, 'fullMessages' => [] },
            'locations' => [
              { 'column' => 7, 'line' => 2 }
            ],
            'message' => 'You are not authorized to perform this action', 'path' => ['createComment']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end

  context 'current_user is defined' do
    let(:current_user) { create(:user) }

    let(:result) do
      {
        'data' => {
          'createComment' => {
            'comment' => {
              'article' => {
                'slug' => 'title-1'
              },
              'author' => {
                'username' => 'user2'
              },
              'body' => 'There are five steps involved.'
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
