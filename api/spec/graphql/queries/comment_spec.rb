# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'comment', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    query CommentQuery($id: ID!) {
      comment(id: $id) {
        id
        body
        canDelete {
          value
        }
        author {
          username
        }
        article {
          slug
        }
      }
    }
    GRAPHQL
  end
  let(:article_author) { create(:author) }
  let(:comment_author) { create(:author) }
  let(:article) { create(:article, author: article_author) }
  let(:comment) { create(:comment, article:, author: comment_author) }
  let(:variables) do
    {
      id: comment.id
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          comment: {
            article: {
              slug: article.slug
            },
            author: {
              username: comment_author.username
            },
            body: comment.body,
            canDelete: { value: false },
            id: comment.id.to_s
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is user' do
    let(:current_user) { create(:user) }
    let(:result) do
      {
        data: {
          comment: {
            article: {
              slug: article.slug
            },
            author: {
              username: comment_author.username
            },
            body: comment.body,
            canDelete: { value: false },
            id: comment.id.to_s
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is comment author' do
    let(:current_user) { comment_author }
    let(:result) do
      {
        data: {
          comment: {
            article: {
              slug: article.slug
            },
            author: {
              username: comment_author.username
            },
            body: comment.body,
            canDelete: { value: true },
            id: comment.id.to_s
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is article author' do
    let(:current_user) { article_author }
    let(:result) do
      {
        data: {
          comment: {
            article: {
              slug: article.slug
            },
            author: {
              username: comment_author.username
            },
            body: comment.body,
            canDelete: { value: true },
            id: comment.id.to_s
          }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
