# frozen_string_literal: true

module Mutations
  # POST /api/articles/:slug/comments
  class AddComment < BaseMutation
    argument :slug, String
    argument :comment, Types::NewCommentInputType
    type Types::CommentType, null: false

    def resolve(slug:, comment:)
      author = require_user!
      article = find_article!(slug)
      save!(article.comments.build(author:, body: comment.body))
    end
  end
end
