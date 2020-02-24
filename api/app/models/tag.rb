# frozen_string_literal: true

class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :articles, through: :taggings

  validates :name, presence: true

  scope :most_used, ->(limit = 20) { order(taggings_count: :desc).limit(limit) }

  # def self.search_by_name(name)
  #   where(arel_table[:name].matches("#{sanitize_sql_like(name)}%"))
  # end
end
