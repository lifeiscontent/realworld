# frozen_string_literal: true

module Mutations
  # POST /api/users/login
  class Login < BaseMutation
    argument :user, Types::LoginUserInputType
    type Types::UserType, null: false

    def resolve(user:)
      account = User.find_for_authentication(email: user.email)
      return account if account.persisted? && account.valid_password?(user.password)

      account.errors.add(:base, 'email or password is invalid')
      Errors.unprocessable!(account)
    end
  end
end
