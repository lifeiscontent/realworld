# frozen_string_literal: true

module Types
  class ArticleType < Types::BaseObject
    graphql_name 'Article'

    field :slug, String, null: false
    field :title, String, null: false
    field :description, String, null: false
    field :body, String, null: false
    field :tag_list, [String], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :favorited, Boolean, null: false, resolver_method: :favorited?,
                               description: 'True when the current user favorited this article.'
    field :favorites_count, Int, null: false
    field :author, ProfileType, null: false

    def tag_list
      object.tags.order('taggings.id').pluck(:name)
    end

    def favorited?
      return false unless current_user

      Favorite.exists?(user: current_user, article: object)
    end
  end
end
