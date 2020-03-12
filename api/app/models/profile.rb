# frozen_string_literal: true

class Profile < ApplicationRecord
  belongs_to :user, validate: true
  validates_presence_of :user
  validates_uniqueness_of :user_id
end
