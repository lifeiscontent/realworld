# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :author, class_name: 'User', foreign_key: 'user_id'
  belongs_to :article

  validates :body, presence: true
end
