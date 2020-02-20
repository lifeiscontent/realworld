# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :articles, Types::ArticleType.connection_type, null: false do
      argument :tag_name, String, required: false
    end

    def articles(tag_name: nil)
      return Article.all if tag_name.nil?

      Article.tagged_with(tag_name)
    end

    field :article, Types::ArticleType, null: false do
      argument :id, ID, required: true
    end

    def article(id:)
      Article.find(id)
    end

    field :popular_tags, [TagType], null: false

    def popular_tags
      Tag.most_used
    end

    field :tag, TagType, null: false do
      argument :id, ID, required: true
    end

    def tag(id:)
      Tag.find(id)
    end
  end
end
