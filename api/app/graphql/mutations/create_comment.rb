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
      article = Article.where(slug: article_slug).select(:id).first
      comment = Comment.create!(
        article: article,
        author: context[:current_user],
        body: input[:body]
      )

      { comment: comment }
    end
  end
end
