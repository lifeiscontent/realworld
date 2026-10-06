# frozen_string_literal: true

module Types
  # The current user, as the RealWorld API returns it for authentication.
  class UserType < Types::BaseObject
    graphql_name 'User'

    field :email, String, null: false
    field :token, String, null: false
    field :username, String, null: false
    field :bio, String
    field :image, String

    def token
      object.generate_jwt
    end

    def bio
      object.profile&.bio.presence
    end

    def image
      object.profile&.image_url.presence
    end
  end
end
