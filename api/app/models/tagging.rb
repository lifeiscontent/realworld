# frozen_string_literal: true

class Tagging < ApplicationRecord
  belongs_to :article
  belongs_to :tag, counter_cache: true
  validates :article, presence: true
  validates :article, uniqueness: { scope: :tag }
  validates :tag, presence: true
end
