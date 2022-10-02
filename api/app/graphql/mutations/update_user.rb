# frozen_string_literal: true

module Mutations
  class UpdateUser < Mutations::BaseMutation
    class UpdateUserProfileInput < Types::BaseInputObject
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
      argument :username, ID, required: false
      argument :profile, UpdateUserProfileInput, required: false, as: :profile_attributes

      def prepare
        to_h
      end

      def nil_if_empty(val)
        val.present? ? val : nil
      end
    end

    argument :username, ID, required: true
    argument :input, UpdateUserInput, required: true

    field :user, Types::UserType, null: false

    def resolve(username:, input:)
      user = User.includes(:profile).find_by(username:)

      authorize! user, to: :update?
      authorize! user.profile, to: :update?

      user.update!(input)

      {
        user:
      }
    end
  end
end
