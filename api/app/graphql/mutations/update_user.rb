# frozen_string_literal: true

module Mutations
  class UpdateUser < Mutations::BaseMutation
    class UpdateUserInput < Types::BaseInputObject
      argument :username, ID, required: false
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
      argument :profile, UpdateUserInput, required: false, as: :profile_attributes

      def prepare
        to_h
      end

      def nil_if_empty(val)
        val.present? ? val : nil
      end
    end

    argument :username, ID, required: true
    argument :input, UpdateUserInput, required: true

    field :user, Types::UserType, null: true

    def resolve(username:, input:)
      user = User.includes(:profile).find_by(username: username)

      authorize! user, to: :update?
      authorize! user.profile, to: :update?

      user.update!(input)

      {
        user: user
      }
    end
  end
end
