# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :article, validate: true
  belongs_to :author, class_name: 'User', validate: true
  validates_presence_of :article, :author, :body
end
