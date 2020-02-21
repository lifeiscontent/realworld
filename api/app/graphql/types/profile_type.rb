# frozen_string_literal: true

module Types
  class ProfileType < Types::BaseObject
    field :id, ID, null: false
    field :username, String, null: false
    field :bio, String, null: false
    field :image_url, String, null: true
    field :articles_connection, ArticleType.connection_type, null: false,
                                                             method: :articles
    field :favorite_articles_connection, ArticleType.connection_type,
          null: false, method: :favorite_articles
    field :followers_count, Int, null: false
  end
end
