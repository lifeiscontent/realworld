# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articleBySlug', type: :graphql do
  before(:each) do
    travel_to Time.zone.local(1994)
  end
  after(:each) do
    travel_back
  end

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
  let(:article) { create(:article, author: author) }
  let(:variables) do
    {
      slug: article.slug
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'articleBySlug' => {
            'author' => {
              'username' => 'user1'
            },
            'body' => 'There are five steps involved.',
            'canCreate' => { 'value' => false },
            'canCreateComment' => { 'value' => false },
            'canDelete' => { 'value' => false },
            'canFavorite' => { 'value' => false },
            'canUnfavorite' => { 'value' => false },
            'canUpdate' => { 'value' => false },
            'comments' => [],
            'createdAt' => '1994-01-01T00:00:00Z',
            'description' => 'There are five steps involved.',
            'slug' => 'title-1',
            'tags' => [],
            'title' => 'Title 1',
            'updatedAt' => '1994-01-01T00:00:00Z',
            'viewerDidFavorite' => false
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
        'data' => {
          'articleBySlug' => {
            'author' => {
              'username' => 'user1'
            },
            'body' => 'There are five steps involved.',
            'canCreate' => { 'value' => true },
            'canCreateComment' => { 'value' => true },
            'canDelete' => { 'value' => false },
            'canFavorite' => { 'value' => true },
            'canUnfavorite' => { 'value' => false },
            'canUpdate' => { 'value' => false },
            'comments' => [],
            'createdAt' => '1994-01-01T00:00:00Z',
            'description' => 'There are five steps involved.',
            'slug' => 'title-1',
            'tags' => [],
            'title' => 'Title 1',
            'updatedAt' => '1994-01-01T00:00:00Z',
            'viewerDidFavorite' => false
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is a user who has favorited the article' do
    let(:current_user) { create(:favorite, article: article, user: build(:user)).user }
    let(:result) do
      {
        'data' => {
          'articleBySlug' => {
            'author' => {
              'username' => 'user1'
            },
            'body' => 'There are five steps involved.',
            'canCreate' => { 'value' => true },
            'canCreateComment' => { 'value' => true },
            'canDelete' => { 'value' => false },
            'canFavorite' => { 'value' => false },
            'canUnfavorite' => { 'value' => true },
            'canUpdate' => { 'value' => false },
            'comments' => [],
            'createdAt' => '1994-01-01T00:00:00Z',
            'description' => 'There are five steps involved.',
            'slug' => 'title-1',
            'tags' => [],
            'title' => 'Title 1',
            'updatedAt' => '1994-01-01T00:00:00Z',
            'viewerDidFavorite' => true
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
        'data' => {
          'articleBySlug' => {
            'author' => {
              'username' => 'user1'
            },
            'body' => 'There are five steps involved.',
            'canCreate' => { 'value' => true },
            'canCreateComment' => { 'value' => true },
            'canDelete' => { 'value' => true },
            'canFavorite' => { 'value' => false },
            'canUnfavorite' => { 'value' => false },
            'canUpdate' => { 'value' => true },
            'comments' => [],
            'createdAt' => '1994-01-01T00:00:00Z',
            'description' => 'There are five steps involved.',
            'slug' => 'title-1',
            'tags' => [],
            'title' => 'Title 1',
            'updatedAt' => '1994-01-01T00:00:00Z',
            'viewerDidFavorite' => false
          }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
