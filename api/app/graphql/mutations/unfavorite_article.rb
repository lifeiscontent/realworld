# frozen_string_literal: true

module Mutations
  class UnfavoriteArticle < Mutations::BaseMutation
    argument :slug, String, required: true

    field :article, Types::ArticleType, null: true
    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(slug:)
      article = Article.find_by(slug: slug)

      authorize! article, to: :unfavorite?

      if context[:current_user].unfavorite(article)
        { user: context[:current_user], article: article, errors: [] }
      else
        { user: nil, article: nil, errors: article.errors.full_messages }
      end
    end
  end
end
