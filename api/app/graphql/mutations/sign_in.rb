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

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(input:)
      session = Session.new(input)

      if session.save
        { user: session.user, errors: [], token: session.token }
      else
        { user: nil, errors: session.errors.full_messages, token: nil }
      end
    end
  end
end
