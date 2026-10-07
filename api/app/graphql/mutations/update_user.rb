# frozen_string_literal: true

module Mutations
  # PUT /api/user
  class UpdateUser < BaseMutation
    argument :user, Types::UpdateUserInputType
    type Types::UserType, null: false

    def resolve(user:)
      account = require_user!
      changes = user.to_h
      account.assign_attributes(changes.slice(:email, :username, :password).compact_blank)
      account.bio = changes[:bio].presence if changes.key?(:bio)
      account.image = changes[:image].presence if changes.key?(:image)
      save!(account)
    end
  end
end
