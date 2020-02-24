# frozen_string_literal: true

module Mutations
  class FollowUser < Mutations::BaseMutation
    argument :id, ID, required: true

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(id:)
      user = User.find_by(id: id)

      authorize! user, to: :follow?

      if context[:current_user].follow(user)
        { user: user, errors: [] }
      else
        { user: nil, errors: user.errors.full_messages }
      end
    end
  end
end
