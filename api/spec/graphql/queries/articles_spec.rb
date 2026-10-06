# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articles', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    query ArticlesQuery($limit: Int, $offset: Int, $tagName: String) {
      articles(limit: $limit, offset: $offset, tagName: $tagName) {
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
  let(:newest_first) { (tagged_articles + articles).reverse }

  def page(articles, total_count)
    { data: { articles: { nodes: articles.map { |article| { slug: article.slug } }, totalCount: total_count } } }
  end

  context 'without arguments' do
    it { is_expected.to eql page(newest_first, 4) }
  end

  context 'with limit' do
    let(:variables) { { limit: 2 } }

    it { is_expected.to eql page(newest_first.first(2), 4) }
  end

  context 'with limit and offset' do
    let(:variables) { { limit: 2, offset: 2 } }

    it { is_expected.to eql page(newest_first.last(2), 4) }
  end

  context 'with an offset after the last article' do
    let(:variables) { { offset: 10 } }

    it { is_expected.to eql page([], 4) }
  end

  context 'with tag' do
    let(:variables) { { tagName: tags.first.name, limit: 1 } }

    it { is_expected.to eql page(tagged_articles.reverse.first(1), 2) }
  end

  context 'with a limit that is not positive' do
    let(:variables) { { limit: 0 } }

    it { expect(subject[:errors].first[:message]).to eq('limit must be greater than 0') }
  end

  context 'with a limit that is too large' do
    let(:variables) { { limit: 101 } }

    it { expect(subject[:errors].first[:message]).to eq('limit must be less than or equal to 100') }
  end

  context 'with a negative offset' do
    let(:variables) { { offset: -1 } }

    it { expect(subject[:errors].first[:message]).to eq('offset must be greater than or equal to 0') }
  end
end
