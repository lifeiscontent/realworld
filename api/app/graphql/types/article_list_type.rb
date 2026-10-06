# frozen_string_literal: true

module Types
  # One page of articles. Clients select the page with the limit and offset
  # arguments, the same as the RealWorld API (?limit=20&offset=0).
  class ArticleListType < Types::BaseObject
    field :nodes, [ArticleType], null: false, description: 'The articles on this page.'
    field :total_count, Int, null: false, description: 'The number of articles on all pages.'

    def nodes
      object[:relation].offset(object[:offset]).limit(object[:limit])
    end

    def total_count
      object[:relation].unscope(:order).count
    end
  end
end
