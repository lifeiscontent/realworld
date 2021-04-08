# frozen_string_literal: true

class Group < ApplicationRecord
  has_many :memberships, dependent: :destroy, validate: true
  has_many :users, through: :memberships
  validates_presence_of :name, :memberships_count
end