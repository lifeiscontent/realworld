# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :article
  belongs_to :author, class_name: 'User'
  validates :article, presence: true
  validates :author, presence: true
  validates :body, presence: true
end
