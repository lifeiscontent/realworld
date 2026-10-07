# frozen_string_literal: true

module Mutations
  # POST /api/articles/:slug/favorite
  class FavoriteArticle < BaseMutation
    argument :slug, String
    type Types::ArticleType, null: false

    def resolve(slug:)
      user = require_user!
      article = find_article!(slug)
      Favorite.create_or_find_by!(user:, article:)
      article.reload
    end
  end
end
