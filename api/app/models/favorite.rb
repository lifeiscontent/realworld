# frozen_string_literal: true

class Favorite < ApplicationRecord
  belongs_to :article, counter_cache: true
  belongs_to :user

  validates :article_id, presence: true
  validates :user_id, presence: true
  validates :article_id, uniqueness: { scope: :user_id }
end
