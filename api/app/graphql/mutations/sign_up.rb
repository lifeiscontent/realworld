# frozen_string_literal: true

module Mutations
  class SignUp < Mutations::BaseMutation
    class SignUpInput < Types::BaseInputObject
      argument :email, String, required: true
      argument :username, String, required: true
      argument :password, String, required: true

      def prepare
        to_h
      end
    end

    argument :input, SignUpInput, required: true

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(input:)
      registration = Registration.new(input)

      if registration.save
        { user: registration.user, errors: [] }
      else
        { user: nil, errors: registration.errors.full_messages }
      end
    end
  end
end
