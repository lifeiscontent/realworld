# frozen_string_literal: true

module Mutations
  class UnfollowUser < Mutations::BaseMutation
    argument :id, ID, required: true

    field :user, Types::UserType, null: true

    def resolve(id:)
      user = User.find_by(id: id)

      authorize! user, to: :unfollow?

      { user: user } if context[:current_user].unfollow!(user)
    end
  end
end
