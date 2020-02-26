# frozen_string_literal: true

class Favorite < ApplicationRecord
  belongs_to :article, counter_cache: true, validate: true
  belongs_to :user, validate: true
  validates :article, presence: true, uniqueness: { scope: :user }
  validates :user, presence: true
end
