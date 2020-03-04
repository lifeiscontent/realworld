# frozen_string_literal: true

module Mutations
  class FollowUser < Mutations::BaseMutation
    argument :username, ID, required: true

    field :user, Types::UserType, null: true

    def resolve(username:)
      user = User.find_by(username: username)

      authorize! user, to: :follow?
      context[:current_user].active_relationships.create!(followed: user)

      { user: user.reload }
    end
  end
end
