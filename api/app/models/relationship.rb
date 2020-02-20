# frozen_string_literal: true

class Relationship < ApplicationRecord
  belongs_to :follower, class_name: 'Profile'
  belongs_to :followed, class_name: 'Profile'

  validates :follower_id, presence: true
  validates :followed_id, presence: true
end
