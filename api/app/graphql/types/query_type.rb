# frozen_string_literal: true

module Types
  # Each field matches one GET endpoint of the RealWorld API.
  class QueryType < Types::BaseObject
    field :user, UserType, description: 'GET /api/user. The current user, or null without a token.'

    def user
      current_user
    end

    field :profile, ProfileType, description: 'GET /api/profiles/:username' do
      argument :username, String
    end

    def profile(username:)
      User.find_by(username:)
    end

    field :articles, MultipleArticlesType, null: false, description: 'GET /api/articles' do
      argument :tag, String, required: false
      argument :author, String, required: false
      argument :favorited, String, required: false, description: 'The username of a user who favorited the articles.'
      limit_offset_arguments
    end

    def articles(limit:, offset:, tag: nil, author: nil, favorited: nil)
      scope = Article.all
      scope = scope.tagged_with(Tag.where(name: tag)) if tag
      scope = scope.joins(:author).where(author: { username: author }) if author
      if favorited
        scope = scope.where(id: Favorite.joins(:user).where(user: { username: favorited }).select(:article_id))
      end
      { relation: scope.order(created_at: :desc), limit:, offset: }
    end

    field :feed, MultipleArticlesType, null: false, description: 'GET /api/articles/feed' do
      limit_offset_arguments
    end

    def feed(limit:, offset:)
      Errors.unauthenticated! unless current_user

      scope = Article.where(author_id: current_user.following.select(:id))
      { relation: scope.order(created_at: :desc), limit:, offset: }
    end

    field :article, ArticleType, description: 'GET /api/articles/:slug' do
      argument :slug, String
    end

    def article(slug:)
      Article.find_by(slug:)
    end

    field :comments, [CommentType], description: 'GET /api/articles/:slug/comments' do
      argument :slug, String
    end

    def comments(slug:)
      Article.find_by(slug:)&.comments&.order(created_at: :desc)
    end

    field :tags, [String], null: false, description: 'GET /api/tags'

    def tags
      Tag.most_used.pluck(:name)
    end
  end
end
