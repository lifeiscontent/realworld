# frozen_string_literal: true

module Types
  # One page of articles, with the number of articles on all pages.
  class MultipleArticlesType < Types::BaseObject
    field :articles, [ArticleType], null: false
    field :articles_count, Int, null: false

    def articles
      object[:relation].offset(object[:offset]).limit(object[:limit])
    end

    def articles_count
      object[:relation].unscope(:order).count
    end
  end
end
