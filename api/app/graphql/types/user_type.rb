# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :username, ID, null: false
    field :email, String, null: false
    field :profile, Types::ProfileType, null: false
    field :followers_count, Int, null: false

    field :viewer_is_following, Boolean, null: false

    def viewer_is_following
      return false if context[:current_user].nil?

      context[:current_user].following.include?(object)
    end

    field :is_viewer, Boolean, null: false, resolver_method: :viewer?

    def viewer?
      object == context[:current_user]
    end

    field :articles_connection, ArticleType.connection_type, null: false

    def articles_connection
      object.articles.order(created_at: :desc)
    end

    field :favorite_articles_connection, ArticleType.connection_type,
          null: false

    def favorite_articles_connection
      object.favorite_articles.order(created_at: :desc)
    end

    expose_authorization_rules :unfollow?, :follow?, :update?
    expose_authorization_rules :create?, with: ArticlePolicy, field_name: 'can_create_article'
  end
end
