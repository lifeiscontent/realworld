# frozen_string_literal: true

module Mutations
  class UpdateUser < Mutations::BaseMutation
    class UpdateUserProfileInput < Types::BaseInputObject
      argument :username, String, required: false
      argument :bio, String, required: false
      argument :image_url, String, required: false, prepare: :nil_if_empty

      def prepare
        to_h
      end

      def nil_if_empty(val)
        val.present? ? val : nil
      end
    end
    class UpdateUserInput < Types::BaseInputObject
      argument :email, String, required: false
      argument :password, String, required: false, prepare: :nil_if_empty
      argument :profile, UpdateUserProfileInput, required: false, as: :profile_attributes

      def prepare
        to_h
      end

      def nil_if_empty(val)
        val.present? ? val : nil
      end
    end

    argument :id, ID, required: true
    argument :input, UpdateUserInput, required: true

    field :user, Types::UserType, null: true
    field :profile, Types::ProfileType, null: true

    def resolve(id:, input:)
      user = User.includes(:profile).find(id)

      authorize! user, to: :update?
      authorize! user.profile, to: :update?

      user.update!(input)

      {
        user: user,
        profile: user.profile
      }
    end
  end
end
