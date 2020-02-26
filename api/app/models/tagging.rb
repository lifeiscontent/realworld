# frozen_string_literal: true

class Tagging < ApplicationRecord
  belongs_to :article, validate: true
  belongs_to :tag, counter_cache: true, validate: true

  validates :article_id, uniqueness: { scope: :tag_id }
  validates :article, presence: true
  validates :tag, presence: true
end
