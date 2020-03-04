# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :feed_connection, ArticleType.connection_type, null: false, authorized_scope: { with: ArticleFeedPolicy } do
      argument :tag_name, String, required: false
    end

    def feed_connection(tag_name: nil)
      scope = Article.all
      scope = scope.tagged_with(tag_name) if tag_name.present?
      scope = scope.order(created_at: :desc)

      scope
    end

    field :articles_connection, ArticleType.connection_type, null: false do
      argument :tag_name, String, required: false
    end

    def articles_connection(tag_name: nil)
      scope = Article.all
      scope = scope.tagged_with(tag_name) if tag_name.present?
      scope = scope.order(created_at: :desc)

      scope
    end

    field :article_by_slug, ArticleType, null: false do
      argument :slug, ID, required: true
    end

    def article_by_slug(slug:)
      Article.find_by(slug: slug)
    end

    field :popular_tags, [TagType], null: false

    def popular_tags
      Tag.most_used
    end

    field :tags, [TagType], null: false

    def tags
      Tag.all
    end

    field :tag, TagType, null: false do
      argument :id, ID, required: true
    end

    def tag(id:)
      Tag.find(id)
    end

    field :comment, CommentType, null: false do
      argument :id, ID, required: true
    end

    def comment(id:)
      Comment.find(id)
    end

    field :user_by_username, UserType, null: false do
      argument :username, ID, required: true
    end

    def user_by_username(username:)
      User.find_by(username: username)
    end

    field :viewer, UserType, null: true

    def viewer
      context[:current_user]
    end
  end
end
