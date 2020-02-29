# frozen_string_literal: true

module Mutations
  class UnfavoriteArticle < Mutations::BaseMutation
    argument :slug, String, required: true

    field :article, Types::ArticleType, null: true
    field :user, Types::UserType, null: true

    def resolve(slug:)
      article = Article.find_by(slug: slug)

      authorize! article, to: :unfavorite?

      { user: context[:current_user], article: article } if context[:current_user].unfavorite!(article)
    end
  end
end
