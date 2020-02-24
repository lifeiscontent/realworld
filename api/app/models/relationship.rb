# frozen_string_literal: true

class Relationship < ApplicationRecord
  belongs_to :followed, class_name: 'User', counter_cache: :following_count
  belongs_to :follower, class_name: 'User', counter_cache: :followers_count

  validates :followed, presence: true
  validates :follower, presence: true
  validates :followed, uniqueness: { scope: :follower }
end
