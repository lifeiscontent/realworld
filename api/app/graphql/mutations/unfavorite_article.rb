# frozen_string_literal: true

module Mutations
  class UnfavoriteArticle < Mutations::BaseMutation
    argument :slug, ID, required: true
    field :article, Types::ArticleType, null: false

    def resolve(slug:)
      article = Article.find_by(slug:)

      authorize! article, to: :unfavorite?

      favorite = Favorite.find_by(article:, user: context[:current_user])
      favorite.destroy!

      { article: favorite.article }
    end
  end
end
