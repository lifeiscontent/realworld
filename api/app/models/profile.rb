# frozen_string_literal: true

class Profile < ApplicationRecord
  belongs_to :user
  validates :username, presence: true, uniqueness: true
  validates :user_id, presence: true, uniqueness: true
end
