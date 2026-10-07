# frozen_string_literal: true

module Types
  class ArticleType < Types::BaseObject
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
      dataloader.with(Sources::TagNames).load(object.id)
    end

    def favorited?
      return false unless current_user

      dataloader.with(Sources::Favorited, current_user).load(object.id)
    end

    def author
      dataload_association(:author)
    end
  end
end
