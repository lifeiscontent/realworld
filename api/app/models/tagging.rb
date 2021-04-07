# frozen_string_literal: true

class Tagging < ApplicationRecord
  belongs_to :taggable, polymorphic: true, validate: true
  belongs_to :tag, counter_cache: true, validate: true
  validates_presence_of :taggable, :tag
  validates_uniqueness_of :tag_id, scope: %i[taggable_id taggable_type]
end
