# frozen_string_literal: true

module Types
  class NewArticleInputType < Types::BaseInputObject
    graphql_name 'NewArticle'
    description 'The new article of POST /api/articles.'

    argument :title, String, required: true
    argument :description, String, required: true
    argument :body, String, required: true
    argument :tag_list, [String], required: false, description: 'The names of the tags. Unknown tags are created.'
  end
end
