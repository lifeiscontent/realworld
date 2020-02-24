# frozen_string_literal: true

class Relationship < ApplicationRecord
  belongs_to :followed, class_name: 'User', counter_cache: :following_count
  belongs_to :follower, class_name: 'User', counter_cache: :followers_count

  validates :followed_id, presence: true
  validates :follower_id, presence: true
  validates :followed_id, uniqueness: { scope: :follower_id }
end
