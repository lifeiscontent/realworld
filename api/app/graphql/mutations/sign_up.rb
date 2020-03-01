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
      user = User.new(email: input[:email], password: input[:password])
      user.build_profile(username: input[:username])
      user.save!

      { user: user }
    end
  end
end
