# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articleBySlug', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    query ArticleBySlugQuery($slug: ID!) {
      articleBySlug(slug: $slug) {
        author {
          username
        }
        body
        canCreate {
          value
        }
        canCreateComment {
          value
        }
        canDelete {
          value
        }
        canFavorite {
          value
        }
        canUnfavorite {
          value
        }
        canUpdate {
          value
        }
        comments {
          id
        }
        createdAt
        description
        slug
        tags {
          id
          name
        }
        title
        updatedAt
        viewerDidFavorite
      }
    }
    GRAPHQL
  end
  let(:author) { create(:author) }
  let(:article) { create(:article, author:) }
  let(:variables) do
    {
      slug: article.slug
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          articleBySlug: {
            author: {
              username: article.author.username
            },
            body: article.body,
            canCreate: { value: false },
            canCreateComment: { value: false },
            canDelete: { value: false },
            canFavorite: { value: false },
            canUnfavorite: { value: false },
            canUpdate: { value: false },
            comments: [],
            createdAt: article.created_at.iso8601.to_s,
            description: article.description,
            slug: article.slug,
            tags: [],
            title: article.title,
            updatedAt: article.updated_at.iso8601.to_s,
            viewerDidFavorite: false
          }
        }
      }
    end

    it { is_expected.to eql result }
  end

  context 'current_user is a user' do
    let(:current_user) { create(:user) }
    let(:result) do
      {
        data: {
          articleBySlug: {
            author: {
              username: article.author.username
            },
            body: article.body,
            canCreate: { value: true },
            canCreateComment: { value: true },
            canDelete: { value: false },
            canFavorite: { value: true },
            canUnfavorite: { value: false },
            canUpdate: { value: false },
            comments: [],
            createdAt: article.created_at.iso8601.to_s,
            description: article.description,
            slug: article.slug,
            tags: [],
            title: article.title,
            updatedAt: article.updated_at.iso8601.to_s,
            viewerDidFavorite: false
          }
        }
      }
    end

    it { is_expected.to eql result }
  end

  context 'current_user is a user who has favorited the article' do
    let(:current_user) { create(:favorite, article:, user: build(:user)).user }
    let(:result) do
      {
        data: {
          articleBySlug: {
            author: {
              username: article.author.username
            },
            body: article.body,
            canCreate: { value: true },
            canCreateComment: { value: true },
            canDelete: { value: false },
            canFavorite: { value: false },
            canUnfavorite: { value: true },
            canUpdate: { value: false },
            comments: [],
            createdAt: article.created_at.iso8601.to_s,
            description: article.description,
            slug: article.slug,
            tags: [],
            title: article.title,
            updatedAt: article.updated_at.iso8601.to_s,
            viewerDidFavorite: true
          }
        }
      }
    end

    it { is_expected.to eql result }
  end

  context 'current_user is the author of the article' do
    let(:current_user) { author }
    let(:result) do
      {
        data: {
          articleBySlug: {
            author: {
              username: article.author.username
            },
            body: article.body,
            canCreate: { value: true },
            canCreateComment: { value: true },
            canDelete: { value: true },
            canFavorite: { value: false },
            canUnfavorite: { value: false },
            canUpdate: { value: true },
            comments: [],
            createdAt: article.created_at.iso8601.to_s,
            description: article.description,
            slug: article.slug,
            tags: [],
            title: article.title,
            updatedAt: article.updated_at.iso8601.to_s,
            viewerDidFavorite: false
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
