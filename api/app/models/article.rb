# frozen_string_literal: true

class Article < ApplicationRecord
  belongs_to :author, class_name: 'Profile', foreign_key: 'profile_id'
  has_many :taggings
  has_many :tags, through: :taggings

  def self.tagged_with(name)
    joins(:taggings).where(taggings: { tag: Tag.where(name: name) })
  end
end
