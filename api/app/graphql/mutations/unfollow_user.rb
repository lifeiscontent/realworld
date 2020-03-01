# frozen_string_literal: true

module Mutations
  class UnfollowUser < Mutations::BaseMutation
    argument :id, ID, required: true

    field :user, Types::UserType, null: true

    def resolve(id:)
      user = User.find_by(id: id)

      authorize! user, to: :unfollow?

      relationship = Relationship.find_by(follower: context[:current_user], followed: user)
      relationship.destroy!

      { user: user.reload }
    end
  end
end
