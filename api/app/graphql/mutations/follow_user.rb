# frozen_string_literal: true

module Mutations
  # POST /api/profiles/:username/follow
  class FollowUser < BaseMutation
    argument :username, String
    type Types::ProfileType, null: false

    def resolve(username:)
      follower = require_user!
      followed = find_user!(username)
      authorize! followed, to: :follow?
      Relationship.create_or_find_by!(follower:, followed:)
      followed.reload
    end
  end
end
