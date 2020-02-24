# frozen_string_literal: true

module Mutations
  class DeleteComment < Mutations::BaseMutation
    argument :id, ID, required: true

    field :comment, Types::CommentType, null: true
    field :errors, [String], null: false

    def resolve(id:)
      comment = Comment.find(id)

      authorize! comment, to: :delete?

      if comment.destroy.destroyed?
        { comment: comment, errors: [] }
      else
        { comment: nil, errors: comment.errors.full_messages }
      end
    end
  end
end
