# frozen_string_literal: true

module Mutations
  class FollowUser < Mutations::BaseMutation
    argument :username, ID, required: true
    field :user, Types::UserType, null: false

    def resolve(username:)
      user = User.find_by(username:)

      authorize! user, to: :follow?
      relationship = Relationship.create!(follower: context[:current_user], followed: user)

      { user: relationship.followed }
    end
  end
end
