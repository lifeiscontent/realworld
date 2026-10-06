# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Articles', type: :graphql do
  let(:article_fields) do
    'slug title description body tagList createdAt updatedAt favorited favoritesCount author { username following }'
  end
  let(:jake) { create(:user, username: 'jake') }
  let(:viewer) { create(:user, username: 'viewer') }
  let(:dragons) { create(:tag, name: 'dragons') }

  describe 'articles (GET /api/articles)' do
    let(:document) do
      <<~GRAPHQL
        query($tag: String, $author: String, $favorited: String, $limit: Int, $offset: Int) {
          articles(tag: $tag, author: $author, favorited: $favorited, limit: $limit, offset: $offset) {
            articles { slug }
            articlesCount
          }
        }
      GRAPHQL
    end
    let!(:oldest) { create(:article, author: jake, tags: [dragons], created_at: 3.days.ago) }
    let!(:middle) { create(:article, author: viewer, created_at: 2.days.ago) }
    let!(:newest) { create(:article, author: jake, created_at: 1.day.ago) }

    def slugs(variables = {})
      result = execute(document, variables:)
      [result.dig(:data, :articles, :articles).pluck(:slug), result.dig(:data, :articles, :articlesCount)]
    end

    it 'returns the most recent articles first' do
      expect(slugs).to eq([[newest.slug, middle.slug, oldest.slug], 3])
    end

    it 'filters by tag, author, and favorited' do
      create(:favorite, user: viewer, article: middle)

      expect(slugs(tag: 'dragons')).to eq([[oldest.slug], 1])
      expect(slugs(author: 'jake')).to eq([[newest.slug, oldest.slug], 2])
      expect(slugs(favorited: 'viewer')).to eq([[middle.slug], 1])
    end

    it 'pages with limit and offset' do
      expect(slugs(limit: 1, offset: 1)).to eq([[middle.slug], 3])
    end

    it 'rejects a limit that is out of range' do
      expect(execute(document, variables: { limit: 0 })[:errors].first[:message]).to eq('limit must be greater than 0')
      expect(execute(document, variables: { limit: 101 })[:errors].first[:message])
        .to eq('limit must be less than or equal to 100')
      expect(execute(document, variables: { offset: -1 })[:errors].first[:message])
        .to eq('offset must be greater than or equal to 0')
    end
  end

  describe 'feed (GET /api/articles/feed)' do
    let(:document) { '{ feed(limit: 10) { articles { slug } articlesCount } }' }

    it 'requires a user' do
      expect(error_codes(execute(document))).to eq(['UNAUTHENTICATED'])
    end

    it 'returns the articles of followed users' do
      followed = create(:article, author: jake)
      create(:article, author: create(:user))
      create(:relationship, follower: viewer, followed: jake)

      expect(execute(document, user: viewer).dig(:data,
                                                 :feed)).to eq(articles: [{ slug: followed.slug }], articlesCount: 1)
    end
  end

  describe 'article (GET /api/articles/:slug)' do
    let(:document) { "query($slug: String!) { article(slug: $slug) { #{article_fields} } }" }

    it 'returns the article' do
      article = create(:article, author: jake, tags: [dragons])

      expect(execute(document, variables: { slug: article.slug }).dig(:data, :article)).to include(
        slug: article.slug, title: article.title, tagList: ['dragons'], favorited: false, favoritesCount: 0,
        author: { username: 'jake', following: false }
      )
    end

    it 'returns null for an unknown slug' do
      expect(execute(document, variables: { slug: 'nothing' })).to eq(data: { article: nil })
    end
  end

  describe 'createArticle (POST /api/articles)' do
    let(:document) { "mutation($article: NewArticle!) { createArticle(article: $article) { #{article_fields} } }" }
    let(:input) do
      { title: 'How to train your dragon', description: 'Ever wonder how?', body: 'You have to believe',
        tagList: ['dragons', ' training ', '', 'dragons'] }
    end

    it 'requires a user' do
      expect(error_codes(execute(document, variables: { article: input }))).to eq(['UNAUTHENTICATED'])
    end

    it 'creates the article and its new tags' do
      dragons

      article = execute(document, variables: { article: input }, user: jake).dig(:data, :createArticle)

      expect(article).to include(slug: 'how-to-train-your-dragon', tagList: %w[dragons training],
                                 author: { username: 'jake', following: false })
      expect(Tag.where(name: 'dragons').count).to eq(1)
    end

    it 'makes a different slug for a duplicate title' do
      first = execute(document, variables: { article: input }, user: jake).dig(:data, :createArticle, :slug)
      second = execute(document, variables: { article: input }, user: jake).dig(:data, :createArticle, :slug)

      expect(second).not_to eq(first)
    end

    it 'returns 422 for missing fields' do
      result = execute(document, variables: { article: input.merge(title: '') }, user: jake)

      expect(error_codes(result)).to eq(['UNPROCESSABLE_ENTITY'])
      expect(result[:errors].first.dig(:extensions, :errors)).to include(title: ["can't be blank"])
    end
  end

  describe 'updateArticle (PUT /api/articles/:slug)' do
    let(:document) do
      <<~GRAPHQL
        mutation($slug: String!, $article: UpdateArticle!) {
          updateArticle(slug: $slug, article: $article) { #{article_fields} }
        }
      GRAPHQL
    end
    let(:article) { create(:article, author: jake, title: 'How to train your dragon', tags: [dragons]) }

    it 'changes the given fields and the slug of a new title' do
      result = execute(document, variables: { slug: article.slug, article: { title: 'Did you train your dragon?' } },
                                 user: jake)

      expect(result.dig(:data, :updateArticle)).to include(
        title: 'Did you train your dragon?', slug: 'did-you-train-your-dragon', body: article.body, tagList: ['dragons']
      )
    end

    it 'removes all tags for an empty tag list' do
      result = execute(document, variables: { slug: article.slug, article: { tagList: [] } }, user: jake)

      expect(result.dig(:data, :updateArticle, :tagList)).to eq([])
    end

    it 'returns 403 for another user' do
      expect(error_codes(execute(document, variables: { slug: article.slug, article: { title: 'X' } }, user: viewer)))
        .to eq(['FORBIDDEN'])
    end

    it 'returns 404 for an unknown slug' do
      expect(error_codes(execute(document, variables: { slug: 'nothing', article: { title: 'X' } }, user: jake)))
        .to eq(['NOT_FOUND'])
    end
  end

  describe 'deleteArticle (DELETE /api/articles/:slug)' do
    let(:document) { 'mutation($slug: String!) { deleteArticle(slug: $slug) }' }
    let(:article) { create(:article, author: jake) }

    it 'deletes the article of the author' do
      expect(execute(document, variables: { slug: article.slug }, user: jake)).to eq(data: { deleteArticle: true })
      expect(Article.exists?(article.id)).to be(false)
    end

    it 'returns 403 for another user' do
      expect(error_codes(execute(document, variables: { slug: article.slug }, user: viewer))).to eq(['FORBIDDEN'])
    end
  end

  describe 'favoriteArticle and unfavoriteArticle (POST and DELETE /api/articles/:slug/favorite)' do
    let(:favorite) { 'mutation($slug: String!) { favoriteArticle(slug: $slug) { favorited favoritesCount } }' }
    let(:unfavorite) { 'mutation($slug: String!) { unfavoriteArticle(slug: $slug) { favorited favoritesCount } }' }
    let(:article) { create(:article, author: jake) }

    it 'requires a user' do
      expect(error_codes(execute(favorite, variables: { slug: article.slug }))).to eq(['UNAUTHENTICATED'])
    end

    it 'favorites once, and unfavorites' do
      2.times do
        expect(execute(favorite, variables: { slug: article.slug }, user: viewer).dig(:data, :favoriteArticle))
          .to eq(favorited: true, favoritesCount: 1)
      end

      expect(execute(unfavorite, variables: { slug: article.slug }, user: viewer).dig(:data, :unfavoriteArticle))
        .to eq(favorited: false, favoritesCount: 0)
    end

    it 'lets the author favorite the article' do
      expect(execute(favorite, variables: { slug: article.slug }, user: jake).dig(:data, :favoriteArticle, :favorited))
        .to be(true)
    end
  end
end
