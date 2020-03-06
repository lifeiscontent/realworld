# frozen_string_literal: true

module Mutations
  class UnfollowUser < Mutations::BaseMutation
    argument :username, ID, required: true
    field :user, Types::UserType, null: true

    def resolve(username:)
      user = User.find_by(username: username)

      authorize! user, to: :unfollow?

      relationship = Relationship.find_by(follower: context[:current_user], followed: user)
      relationship.destroy!

      { user: relationship.followed }
    end
  end
end
