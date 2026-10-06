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
      profile = account.profile || account.build_profile
      profile.bio = changes[:bio] || '' if changes.key?(:bio)
      profile.image_url = changes[:image].presence if changes.key?(:image)
      save!(account)
    end
  end
end
