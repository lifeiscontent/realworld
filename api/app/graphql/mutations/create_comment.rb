# frozen_string_literal: true

module Mutations
  class CreateComment < Mutations::BaseMutation
    class CreateCommentInput < Types::BaseInputObject
      argument :body, String, required: true

      def prepare
        to_h
      end
    end

    argument :article_slug, String, required: true
    argument :input, CreateCommentInput, required: true

    field :comment, Types::CommentType, null: true

    def resolve(article_slug:, input:)
      authorize! Comment, to: :create?

      comment = Comment.new(input)
      comment.article = Article.find_by(slug: article_slug)
      comment.author = context[:current_user]

      { comment: comment } if comment.save!
    end
  end
end
