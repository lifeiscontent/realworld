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

    def resolve(input:)
      registration = Registration.new(input)

      { user: registration.user } if registration.save!
    end
  end
end
