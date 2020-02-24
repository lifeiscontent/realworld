# frozen_string_literal: true

class Tagging < ApplicationRecord
  belongs_to :article
  belongs_to :tag, counter_cache: true

  validates :article_id, presence: true
  validates :tag_id, presence: true
  validates :article_id, uniqueness: { scope: :tag_id }
end
