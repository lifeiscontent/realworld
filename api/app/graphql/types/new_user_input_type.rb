# frozen_string_literal: true

module Types
  class NewUserInputType < Types::BaseInputObject
    graphql_name 'NewUser'
    description 'The new user of POST /api/users.'

    argument :username, String, required: true
    argument :email, String, required: true
    argument :password, String, required: true
  end
end
