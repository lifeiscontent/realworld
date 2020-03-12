# frozen_string_literal: true

class Favorite < ApplicationRecord
  belongs_to :article, counter_cache: true, validate: true
  belongs_to :user, validate: true
  validates_presence_of :user, :article
  validates_uniqueness_of :article_id, scope: :user_id
end
