# frozen_string_literal: true

class Relationship < ApplicationRecord
  belongs_to :followed, class_name: 'User', counter_cache: :followers_count, validate: true
  belongs_to :follower, class_name: 'User', counter_cache: :following_count, validate: true

  validates :followed, presence: true
  validates :follower, presence: true
  validates :followed_id, uniqueness: { scope: :follower_id }
end
