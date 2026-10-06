# frozen_string_literal: true

module Mutations
  class UpdateArticle < Mutations::BaseMutation
    class UpdateArticleInput < Types::BaseInputObject
      argument :title, String, required: true
      argument :description, String, required: true
      argument :body, String, required: true
      argument :tag_list, [String], required: true, description: 'The names of the tags. Unknown tags are created.'

      def prepare
        attributes = to_h
        attributes.merge(tags: Tag.from_names(attributes.delete(:tag_list)))
      end
    end

    argument :slug, ID, required: true
    argument :input, UpdateArticleInput, required: true

    field :article, Types::ArticleType, null: false

    def resolve(slug:, input:)
      article = Article.find_by(slug:)

      authorize! article, to: :update?

      article.update!(input)

      { article: }
    end
  end
end
