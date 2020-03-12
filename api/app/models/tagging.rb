# frozen_string_literal: true

class Tagging < ApplicationRecord
  belongs_to :article, validate: true
  belongs_to :tag, counter_cache: true, validate: true
  validates_presence_of :article, :tag
  validates_uniqueness_of :tag_id, scope: :article_id
end
