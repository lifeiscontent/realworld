# frozen_string_literal: true

class Article < ApplicationRecord
  belongs_to :author, class_name: 'Profile', foreign_key: 'profile_id'
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  has_many :comments, dependent: :destroy

  def self.feed_for(user)
    joins(:users, :profiles).where(author: user.profile.following)
  end

  def self.tagged_with(name)
    joins(:taggings).where(taggings: { tag: Tag.where(name: name) })
  end
end
