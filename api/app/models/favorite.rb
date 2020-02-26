# frozen_string_literal: true

class Favorite < ApplicationRecord
  belongs_to :article, counter_cache: true, validate: true
  belongs_to :user, validate: true
  validates :article_id, presence: true, uniqueness: { scope: :user_id }
  validates :user, presence: true
end
