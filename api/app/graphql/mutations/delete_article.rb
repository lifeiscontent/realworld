# frozen_string_literal: true

module Mutations
  class DeleteArticle < Mutations::BaseMutation
    argument :slug, String, required: true

    field :article, Types::ArticleType, null: true
    field :errors, [String], null: false

    def resolve(slug:)
      article = Article.find_by(slug: slug)

      authorize! article, to: :delete?

      if article.destroy.destroyed?
        { article: article, errors: [] }
      else
        { article: nil, errors: article.errors.full_messages }
      end
    end
  end
end
