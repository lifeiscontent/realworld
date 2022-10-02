# frozen_string_literal: true

module Types
  class ProfileType < Types::BaseObject
    field :id, ID, null: false
    field :bio, String, null: false
    field :image_url, String, null: true
    field :user, UserType, null: false

    expose_authorization_rules :update?
  end
end
