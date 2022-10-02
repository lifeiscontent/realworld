# frozen_string_literal: true

module Mutations
  class DeleteArticle < Mutations::BaseMutation
    argument :slug, ID, required: true

    field :article, Types::ArticleType, null: false

    def resolve(slug:)
      article = Article.find_by(slug:)

      authorize! article, to: :delete?
      article.destroy!

      { article: }
    end
  end
end
