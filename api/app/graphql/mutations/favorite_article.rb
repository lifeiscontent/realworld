# frozen_string_literal: true

module Mutations
  class FavoriteArticle < Mutations::BaseMutation
    argument :slug, ID, required: true
    field :article, Types::ArticleType, null: false

    def resolve(slug:)
      article = Article.find_by(slug:)

      authorize! article, to: :favorite?
      favorite = Favorite.create!(article:, user: context[:current_user])

      { article: favorite.article }
    end
  end
end
