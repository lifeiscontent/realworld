# frozen_string_literal: true

module Mutations
  class UpdateSettings < Mutations::BaseMutation
    class UpdateSettingsInput < Types::BaseInputObject
      argument :username, String, required: false
      argument :email, String, required: false
      argument :password, String, required: false
      argument :bio, String, required: false
      argument :image_url, String, required: false, prepare: :nil_if_empty

      def prepare
        to_h
      end

      def nil_if_empty(val)
        val.present? ? val : nil
      end
    end

    argument :id, ID, required: true
    argument :input, UpdateSettingsInput, required: true

    field :user, Types::UserType, null: true
    field :profile, Types::ProfileType, null: true
    field :errors, [String], null: false

    def resolve(id:, input:)
      settings = Settings.new(user: User.find(id), **input)

      authorize! settings, to: :update?

      if settings.save
        { user: settings.user, profile: settings.user.profile, errors: [] }
      else
        { user: nil, profile: nil, errors: settings.errors.full_messages }
      end
    end
  end
end
