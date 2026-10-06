# frozen_string_literal: true

module Types
  class BaseObject < GraphQL::Schema::Object
    include ActionPolicy::GraphQL::Behaviour

    field_class Types::BaseField

    private

    def current_user
      context[:current_user]
    end
  end
end
