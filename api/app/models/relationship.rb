# frozen_string_literal: true

class Relationship < ApplicationRecord
  belongs_to :followed, class_name: 'User', counter_cache: :followers_count, validate: true
  belongs_to :follower, class_name: 'User', counter_cache: :following_count, validate: true
  validates_presence_of :followed, :follower
  validates_uniqueness_of :follower_id, scope: :followed_id
end
