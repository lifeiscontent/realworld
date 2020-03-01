# frozen_string_literal: true

module Mutations
  class DeleteComment < Mutations::BaseMutation
    argument :id, ID, required: true

    field :comment, Types::CommentType, null: true

    def resolve(id:)
      comment = Comment.find(id)

      authorize! comment, to: :delete?
      comment.destroy!

      { comment: comment }
    end
  end
end
