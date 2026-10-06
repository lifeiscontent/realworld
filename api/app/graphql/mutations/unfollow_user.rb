# frozen_string_literal: true

module Mutations
  # DELETE /api/profiles/:username/follow
  class UnfollowUser < BaseMutation
    argument :username, String
    type Types::ProfileType, null: false

    def resolve(username:)
      follower = require_user!
      followed = find_user!(username)
      authorize! followed, to: :unfollow?
      Relationship.where(follower:, followed:).destroy_all
      followed.reload
    end
  end
end
