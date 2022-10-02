# frozen_string_literal: true

module Mutations
  class SignUp < Mutations::BaseMutation
    class SignUpInput < Types::BaseInputObject
      argument :email, String, required: true
      argument :username, ID, required: true
      argument :password, String, required: true

      def prepare
        to_h
      end
    end

    argument :input, SignUpInput, required: true
    field :user, Types::UserType, null: false

    def resolve(input:)
      user = User.new(input)
      user.build_profile
      user.save!

      { user: }
    end
  end
end
