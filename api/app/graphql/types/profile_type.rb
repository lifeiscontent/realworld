# frozen_string_literal: true

module Types
  class ProfileType < Types::BaseObject
    field :id, ID, null: false
    field :username, String, null: false
    field :bio, String, null: false
    field :image, String, null: true
    # field :user, UserType, null: false
  end
end
