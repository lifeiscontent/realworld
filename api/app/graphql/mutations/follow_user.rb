# frozen_string_literal: true

module Mutations
  class FollowUser < Mutations::BaseMutation
    argument :id, ID, required: true

    field :user, Types::UserType, null: true

    def resolve(id:)
      user = User.find_by(id: id)

      authorize! user, to: :follow?
      context[:current_user].active_relationships.create!(followed: user)

      { user: user.reload }
    end
  end
end
