# frozen_string_literal: true

module Mutations
  # POST /api/users/login
  class Login < BaseMutation
    argument :user, Types::LoginUserInputType
    type Types::UserType, null: false

    def resolve(user:)
      account = User.authenticate_by(email: user.email, password: user.password)
      return account if account

      # Give one error for both cases, so the answer does not show if the email exists.
      invalid = User.new
      invalid.errors.add(:base, 'email or password is invalid')
      Errors.unprocessable!(invalid)
    end
  end
end
