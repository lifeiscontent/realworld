# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :article
  belongs_to :author, class_name: 'User'
  validates :article_id, presence: true
  validates :author_id, presence: true
  validates :body, presence: true
end
