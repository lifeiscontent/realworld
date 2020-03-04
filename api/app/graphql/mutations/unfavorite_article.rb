# frozen_string_literal: true

module Mutations
  class UnfavoriteArticle < Mutations::BaseMutation
    argument :slug, ID, required: true
    field :article, Types::ArticleType, null: true
    field :user, Types::UserType, null: true

    def resolve(slug:)
      article = Article.find_by(slug: slug)

      authorize! article, to: :unfavorite?

      favorite = Favorite.find_by(article: article, user: context[:current_user])
      favorite.destroy!

      { article: article.reload }
    end
  end
end
