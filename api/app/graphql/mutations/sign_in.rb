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

    def resolve(input:)
      session = Session.new(input)

      { user: session.user, token: session.token } if session.save!
    end
  end
end
