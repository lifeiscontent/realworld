# frozen_string_literal: true

module Mutations
  class CreateArticle < Mutations::BaseMutation
    class CreateArticleInput < Types::BaseInputObject
      argument :title, String, required: true
      argument :description, String, required: true
      argument :body, String, required: true
      argument :tag_list, [String], required: true, description: 'The names of the tags. Unknown tags are created.'

      def prepare
        attributes = to_h
        attributes.merge(tags: Tag.from_names(attributes.delete(:tag_list)))
      end
    end

    argument :input, CreateArticleInput, required: true
    field :article, Types::ArticleType, null: false

    def resolve(input:)
      authorize! Article, to: :create?

      article = context[:current_user].articles.create!(input)

      { article: }
    end
  end
end
