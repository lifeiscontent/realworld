# frozen_string_literal: true

module Types
  class UpdateArticleInputType < Types::BaseInputObject
    graphql_name 'UpdateArticle'
    description 'The changes of PUT /api/articles/:slug. Fields that are not given do not change.'

    argument :title, String, required: false
    argument :description, String, required: false
    argument :body, String, required: false
    argument :tag_list, [String], required: false, description: 'The names of the tags. Unknown tags are created.'
  end
end
