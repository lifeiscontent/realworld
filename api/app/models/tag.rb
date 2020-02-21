# frozen_string_literal: true

class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :articles, through: :taggings

  scope :most_used, ->(limit = 20) { order(taggings_count: :desc).limit(limit) }
end
