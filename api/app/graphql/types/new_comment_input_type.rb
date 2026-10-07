# frozen_string_literal: true

module Types
  class NewCommentInputType < Types::BaseInputObject
    graphql_name 'NewComment'
    description 'The new comment of POST /api/articles/:slug/comments.'

    argument :body, String, required: true
  end
end
