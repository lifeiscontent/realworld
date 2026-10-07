# frozen_string_literal: true

module Mutations
  # Each mutation matches one write endpoint of the RealWorld API and returns
  # what that endpoint returns.
  class BaseMutation < GraphQL::Schema::Mutation
    include ActionPolicy::GraphQL::Behaviour

    argument_class Types::BaseArgument
    field_class Types::BaseField
    object_class Types::BaseObject

    private

    def current_user
      context[:current_user]
    end

    def require_user!
      current_user || Errors.unauthenticated!
    end

    def find_article!(slug)
      Article.find_by(slug:) || Errors.not_found!('Article not found')
    end

    def find_user!(username)
      User.find_by(username:) || Errors.not_found!('Profile not found')
    end

    def save!(record)
      record.save || Errors.unprocessable!(record)
      record
    end
  end
end
