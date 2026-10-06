# frozen_string_literal: true

module Types
  # The public profile of a user.
  class ProfileType < Types::BaseObject
    graphql_name 'Profile'

    field :username, String, null: false
    field :bio, String
    field :image, String
    field :following, Boolean, null: false, resolver_method: :following?,
                               description: 'True when the current user follows this user.'

    def bio
      object.profile&.bio.presence
    end

    def image
      object.profile&.image_url.presence
    end

    def following?
      return false unless current_user

      Relationship.exists?(follower: current_user, followed: object)
    end
  end
end
