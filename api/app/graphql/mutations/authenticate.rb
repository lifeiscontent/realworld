# frozen_string_literal: true

module Mutations
  class Authenticate < Mutations::BaseMutation
    class AuthenticateInput < Types::BaseInputObject
      argument :email, String, required: true
      argument :password, String, required: true
    end

    argument :input, AuthenticateInput, required: true

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(input:)
      user = User.find_for_authentication(email: input.email) || User.new

      if user.valid_password?(input.password)
        { user: user, errors: [], token: user.generate_jwt }
      else
        user.errors.add(:base, 'Email or password is invalid')
        { user: nil, errors: user.errors.full_messages, token: nil }
      end
    end
  end
end
