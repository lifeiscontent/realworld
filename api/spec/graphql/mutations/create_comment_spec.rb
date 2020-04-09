# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'createComment', type: :graphql do
  let(:mutation) do
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
        data: {
          createComment: nil
        },
        errors: [
          {
            extensions: { code: 'UNAUTHORIZED', details: {}, fullMessages: [] },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action', path: ['createComment']
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
        data: {
          createComment: {
            comment: {
              article: {
                slug: article.slug
              },
              author: {
                username: current_user.username
              },
              body: comment_attributes[:body]
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
