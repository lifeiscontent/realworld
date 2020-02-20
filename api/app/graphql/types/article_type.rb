# frozen_string_literal: true

module Types
  class ArticleType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :slug, String, null: false
    field :body, String, null: false
    field :description, String, null: true
    field :favorites_count, Int, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :author, Types::ProfileType, null: false
    # field :comments, [Types::CommentType], null: false
    # field :favorites, [Types::FavoriteType], null: false
  end
end
