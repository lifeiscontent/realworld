# frozen_string_literal: true

module Mutations
  # POST /api/users
  class Register < BaseMutation
    argument :user, Types::NewUserInputType
    type Types::UserType, null: false

    def resolve(user:)
      save!(User.new(username: user.username, email: user.email, password: user.password))
    end
  end
end
