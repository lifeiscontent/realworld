# frozen_string_literal: true

module Types
  class UpdateUserInputType < Types::BaseInputObject
    graphql_name 'UpdateUser'
    description 'The changes of PUT /api/user. Fields that are not given do not change.'

    argument :email, String, required: false
    argument :username, String, required: false
    argument :password, String, required: false
    argument :image, String, required: false, description: 'The URL of the profile image. An empty string removes it.'
    argument :bio, String, required: false
  end
end
