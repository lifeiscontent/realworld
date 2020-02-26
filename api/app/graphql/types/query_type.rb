# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :feed_connection, ArticleType.connection_type, null: false, authorized_scope: true do
      argument :tag_name, String, required: false
    end

    def feed_connection(tag_name: nil)
      return Article.all if tag_name.nil?

      Article.tagged_with(tag_name)
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
      argument :slug, String, required: true
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

    field :profile_by_username, ProfileType, null: false do
      argument :username, String, required: true
    end

    def profile_by_username(username:)
      Profile.find_by(username: username)
    end

    field :user, UserType, null: false do
      argument :id, ID, required: true
    end

    def user(id:)
      User.find(id)
    end

    field :viewer, UserType, null: true

    def viewer
      context[:current_user]
    end
  end
end
