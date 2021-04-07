# frozen_string_literal: true

module Types
  class QuestionType < Types::BaseObject
    field :author, UserType, null: false
    field :body, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :tags, [TagType], null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    expose_authorization_rules :update?, :delete?, :create?, :show?, :index?,
                               prefix: 'can_'
  end
end
