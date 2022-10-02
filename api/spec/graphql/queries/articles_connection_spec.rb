# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articlesConnection', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    query ArticleConnectionQuery($before: String, $after: String, $first: Int, $last: Int, $tagName: String) {
      articlesConnection(before: $before, after:$after, first: $first, last: $last, tagName: $tagName) {
        edges {
          node {
            slug
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
    GRAPHQL
  end

  let(:author) { create(:author) }
  let(:tags) { create_list(:tag, 1) }

  let(:variables) do
    { first: 2 }
  end

  let!(:tagged_articles) { create_list(:article, 2, author:, tags:) }
  let!(:articles) { create_list(:article, 2, author:) }

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          articlesConnection: {
            edges: articles.reverse.map { |article| { node: { slug: article.slug } } },
            pageInfo: {
              endCursor: 'Mg',
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: 'MQ'
            }
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is nil with tag' do
    let(:variables) do
      { first: 4, tagName: tags.first.name }
    end
    let(:result) do
      {
        data: {
          articlesConnection: {
            edges: tagged_articles.reverse.map { |article| { node: { slug: article.slug } } },
            pageInfo: {
              endCursor: 'Mg',
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 'MQ'
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
