# frozen_string_literal: true

module Types
  class LoginUserInputType < Types::BaseInputObject
    graphql_name 'LoginUser'
    description 'The credentials of POST /api/users/login.'

    argument :email, String, required: true
    argument :password, String, required: true
  end
end
