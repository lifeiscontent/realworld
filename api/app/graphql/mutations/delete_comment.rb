# frozen_string_literal: true

module Mutations
  # DELETE /api/articles/:slug/comments/:id
  class DeleteComment < BaseMutation
    argument :slug, String
    argument :id, ID
    type Boolean, null: false

    def resolve(slug:, id:)
      require_user!
      comment = find_article!(slug).comments.find_by(id:) || Errors.not_found!('Comment not found')
      authorize! comment, to: :delete?
      comment.destroy!
      comment.destroyed?
    end
  end
end
