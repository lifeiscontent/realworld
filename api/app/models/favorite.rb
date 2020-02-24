# frozen_string_literal: true

class Favorite < ApplicationRecord
  belongs_to :article, counter_cache: true
  belongs_to :user
  validates :article, presence: true
  validates :article, uniqueness: { scope: :user }
  validates :user, presence: true
end
