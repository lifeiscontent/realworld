# frozen_string_literal: true

module Mutations
  class FollowUser < Mutations::BaseMutation
    argument :id, ID, required: true

    field :user, Types::UserType, null: true

    def resolve(id:)
      user = User.find_by(id: id)

      authorize! user, to: :follow?

      { user: user } if context[:current_user].follow!(user)
    end
  end
end
