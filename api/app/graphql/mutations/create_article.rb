# frozen_string_literal: true

module Mutations
  # POST /api/articles
  class CreateArticle < BaseMutation
    argument :article, Types::NewArticleInputType
    type Types::ArticleType, null: false

    def resolve(article:)
      author = require_user!
      attributes = article.to_h
      record = author.articles.build(attributes.slice(:title, :description, :body))
      record.tags = Tag.from_names(attributes.fetch(:tag_list, []))
      save!(record)
    end
  end
end
