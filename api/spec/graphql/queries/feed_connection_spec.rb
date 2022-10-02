# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'feedConnection', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    query FeedConnectionQuery($before: String, $after: String, $first: Int, $last: Int, $tagName: String) {
      feedConnection(before: $before, after:$after, first: $first, last: $last, tagName: $tagName) {
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

  let!(:tagged_articles) { create_list(:article, 2, author:, tags:) }
  let!(:articles) { create_list(:article, 2, author:) }

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          feedConnection: {
            edges: [],
            pageInfo: {
              endCursor: nil,
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: nil
            }
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
          feedConnection: {
            edges: [],
            pageInfo: {
              endCursor: nil,
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: nil
            }
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is a user who follows author' do
    let(:current_user) { create(:relationship, follower: create(:user), followed: author).follower }
    let(:variables) do
      { first: 2 }
    end
    let(:result) do
      {
        data: {
          feedConnection: {
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

  context 'current_user is a user who follows author with tag' do
    let(:current_user) { create(:relationship, follower: create(:user), followed: author).follower }
    let(:variables) do
      { first: 2, tagName: tags.first.name }
    end
    let(:result) do
      {
        data: {
          feedConnection: {
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
