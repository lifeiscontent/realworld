# frozen_string_literal: true

module Mutations
  class UpdateArticle < Mutations::BaseMutation
    class UpdateArticleInput < Types::BaseInputObject
      argument :title, String, required: true
      argument :description, String, required: true
      argument :body, String, required: true
      argument :tag_ids, [ID], required: true

      def prepare
        to_h
      end
    end

    argument :slug, String, required: true
    argument :input, UpdateArticleInput, required: true

    field :article, Types::ArticleType, null: true

    def resolve(slug:, input:)
      article = Article.find_by(slug: slug)

      authorize! article, to: :update?

      article.update!(input)

      { article: article }
    end
  end
end
