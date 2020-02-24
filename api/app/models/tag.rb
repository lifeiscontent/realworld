# frozen_string_literal: true

class Tag < ApplicationRecord
  has_many :articles, through: :taggings
  has_many :taggings, dependent: :destroy
  scope :most_used, ->(limit = 20) { order(taggings_count: :desc).limit(limit) }
  validates :name, presence: true
end
