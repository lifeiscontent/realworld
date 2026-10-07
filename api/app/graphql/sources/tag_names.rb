# frozen_string_literal: true

module Sources
  # Loads the tag names of many articles in one query. The names of each
  # article are in the order that the tags were added.
  class TagNames < GraphQL::Dataloader::Source
    def fetch(article_ids)
      names = Tagging.joins(:tag)
                     .where(article_id: article_ids)
                     .order(:id)
                     .pluck(:article_id, 'tags.name')
                     .group_by(&:first)
      article_ids.map { |id| names.fetch(id, []).map(&:last) }
    end
  end
end
