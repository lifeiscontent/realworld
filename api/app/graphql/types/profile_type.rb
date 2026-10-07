# frozen_string_literal: true

module Types
  # The public profile of a user.
  class ProfileType < Types::BaseObject
    field :username, String, null: false
    field :bio, String
    field :image, String
    field :following, Boolean, null: false, resolver_method: :following?,
                               description: 'True when the current user follows this user.'

    def bio
      object.bio.presence
    end

    def image
      object.image.presence
    end

    def following?
      return false unless current_user

      dataloader.with(Sources::Following, current_user).load(object.id)
    end
  end
end
