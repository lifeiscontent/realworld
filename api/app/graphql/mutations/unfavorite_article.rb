# frozen_string_literal: true

module Mutations
  # DELETE /api/articles/:slug/favorite
  class UnfavoriteArticle < BaseMutation
    argument :slug, String
    type Types::ArticleType, null: false

    def resolve(slug:)
      user = require_user!
      article = find_article!(slug)
      Favorite.where(user:, article:).destroy_all
      article.reload
    end
  end
end
