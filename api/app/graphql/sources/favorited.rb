# frozen_string_literal: true

module Sources
  # Loads, in one query, which of many articles the user favorited.
  class Favorited < GraphQL::Dataloader::Source
    def initialize(user)
      super()
      @user = user
    end

    def fetch(article_ids)
      favorited = Favorite.where(user: @user, article_id: article_ids).pluck(:article_id).to_set
      article_ids.map { |id| favorited.include?(id) }
    end
  end
end
