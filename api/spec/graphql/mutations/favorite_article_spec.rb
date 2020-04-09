# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'favoriteArticle', type: :graphql do
  let(:mutation) do
    <<-GRAPHQL
    mutation FavoriteArticleMutation($slug: ID!) {
      favoriteArticle(slug: $slug) {
        article {
          slug
          favoritesCount
        }
      }
    }
    GRAPHQL
  end
  let(:user) { create(:user) }
  let(:tags) { create_list(:tag, 3) }
  let(:article) { create(:article, author: create(:author)) }
  let(:variables) do
    {
      slug: article.slug
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          favoriteArticle: nil
        },
        errors: [
          {
            extensions: { code: 'UNAUTHORIZED', details: {}, fullMessages: [] },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action', path: ['favoriteArticle']
          }
        ]
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is defined' do
    let(:current_user) { user }

    let(:result) do
      {
        data: {
          favoriteArticle: {
            article: {
              favoritesCount: article.reload.favorites_count,
              slug: article.slug
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
