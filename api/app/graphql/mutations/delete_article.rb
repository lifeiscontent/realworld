# frozen_string_literal: true

module Mutations
  class DeleteArticle < Mutations::BaseMutation
    argument :slug, String, required: true

    field :article, Types::ArticleType, null: true

    def resolve(slug:)
      article = Article.find_by(slug: slug)

      authorize! article, to: :delete?
      article.destroy!

      { article: article }
    end
  end
end
