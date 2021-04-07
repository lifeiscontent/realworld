# frozen_string_literal: true

class Question < ApplicationRecord
  belongs_to :author, class_name: 'User', validate: true
  has_many :taggings, as: :taggable, dependent: :destroy, validate: true
  has_many :tags, through: :taggings, validate: true

  validates :body, presence: true
  validates :author, presence: true
end
