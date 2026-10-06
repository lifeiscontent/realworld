# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'feed', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    query FeedQuery($limit: Int, $offset: Int, $tagName: String) {
      feed(limit: $limit, offset: $offset, tagName: $tagName) {
        nodes {
          slug
        }
        totalCount
      }
    }
    GRAPHQL
  end

  let(:author) { create(:author) }
  let(:tags) { create_list(:tag, 1) }
  let(:variables) { {} }

  let!(:tagged_articles) { create_list(:article, 2, author:, tags:) }
  let!(:articles) { create_list(:article, 2, author:) }
  let!(:other_article) { create(:article, author: create(:author)) }

  def page(articles, total_count)
    { data: { feed: { nodes: articles.map { |article| { slug: article.slug } }, totalCount: total_count } } }
  end

  context 'current_user is not defined' do
    it { is_expected.to eql page([], 0) }
  end

  context 'current_user is a user' do
    let(:current_user) { create(:user) }

    it { is_expected.to eql page([], 0) }
  end

  context 'current_user is a user who follows author' do
    let(:current_user) { create(:relationship, follower: create(:user), followed: author).follower }
    let(:variables) { { limit: 2, offset: 1 } }

    it { is_expected.to eql page((tagged_articles + articles).reverse[1, 2], 4) }
  end

  context 'current_user is a user who follows author with tag' do
    let(:current_user) { create(:relationship, follower: create(:user), followed: author).follower }
    let(:variables) { { tagName: tags.first.name } }

    it { is_expected.to eql page(tagged_articles.reverse, 2) }
  end
end
