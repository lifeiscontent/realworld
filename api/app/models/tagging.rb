# frozen_string_literal: true

class Tagging < ApplicationRecord
  belongs_to :article, validate: true
  belongs_to :tag, counter_cache: true, validate: true
  validates :tag_id, uniqueness: { scope: :article_id }
end
