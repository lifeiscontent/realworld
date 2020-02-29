# frozen_string_literal: true

module Mutations
  class CreateArticle < Mutations::BaseMutation
    class CreateArticleInput < Types::BaseInputObject
      argument :title, String, required: true
      argument :description, String, required: true
      argument :body, String, required: true
      argument :tag_ids, [ID], required: true

      def prepare
        to_h
      end
    end

    argument :input, CreateArticleInput, required: true

    field :article, Types::ArticleType, null: true

    def resolve(input:)
      article = Article.new(input)

      authorize! Article, to: :create?

      article.author = context[:current_user]

      { article: article } if article.save!
    end
  end
end
