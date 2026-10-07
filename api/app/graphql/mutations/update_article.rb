# frozen_string_literal: true

module Mutations
  # PUT /api/articles/:slug. The slug changes when the title changes.
  class UpdateArticle < BaseMutation
    argument :slug, String
    argument :article, Types::UpdateArticleInputType
    type Types::ArticleType, null: false

    def resolve(slug:, article:)
      require_user!
      record = find_article!(slug)
      authorize! record, to: :update?
      attributes = article.to_h
      record.assign_attributes(attributes.slice(:title, :description, :body))
      record.tags = Tag.from_names(attributes[:tag_list]) if attributes.key?(:tag_list)
      save!(record)
    end
  end
end
