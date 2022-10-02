# frozen_string_literal: true

module Mutations
  class SignIn < Mutations::BaseMutation
    class SignInInput < Types::BaseInputObject
      argument :email, String, required: true
      argument :password, String, required: true

      def prepare
        to_h
      end
    end

    argument :input, SignInInput, required: true
    field :user, Types::UserType, null: false
    field :token, String, null: false

    def resolve(input:)
      user = User.find_for_authentication(email: input[:email])

      user.authenticate!(input[:password])

      { user:, token: user.generate_jwt }
    end
  end
end
