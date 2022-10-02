# frozen_string_literal: true

module Mutations
  class CreateComment < Mutations::BaseMutation
    class CreateCommentInput < Types::BaseInputObject
      argument :body, String, required: true
      def prepare
        to_h
      end
    end

    argument :article_slug, ID, required: true
    argument :input, CreateCommentInput, required: true

    field :comment, Types::CommentType, null: false

    def resolve(article_slug:, input:)
      authorize! Comment, to: :create?
      article = Article.find_by(slug: article_slug)
      comment = Comment.create!(
        article:,
        author: context[:current_user],
        body: input[:body]
      )

      { comment: }
    end
  end
end
