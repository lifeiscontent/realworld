# frozen_string_literal: true

module Mutations
  # DELETE /api/articles/:slug
  class DeleteArticle < BaseMutation
    argument :slug, String
    type Boolean, null: false

    def resolve(slug:)
      require_user!
      record = find_article!(slug)
      authorize! record, to: :delete?
      record.destroy!
      record.destroyed?
    end
  end
end
