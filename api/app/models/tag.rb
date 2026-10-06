# frozen_string_literal: true

class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :articles, through: :taggings
  validates_presence_of :name, :taggings_count

  # Finds or creates the tags with these names. It ignores blank and
  # duplicate names.
  def self.from_names(names)
    names.map(&:strip).compact_blank.uniq.map { |name| create_or_find_by!(name:) }
  end

  def self.most_used(limit = 20)
    where.not(taggings_count: 0).order(taggings_count: :desc).limit(limit)
  end
end
