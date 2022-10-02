# frozen_string_literal: true

class Article < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged
  before_validation :set_slug, only: %i[create update]
  belongs_to :author, class_name: 'User', validate: true
  has_many :comments, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  has_many :users_who_favorited, through: :favorites, source: :user
  validates_presence_of :body, :description, :slug, :title, :favorites_count
  validates_uniqueness_of :slug

  def self.feed_for(user)
    return none unless user.present?

    joins(:author).merge(user.following)
  end

  def self.tagged_with(tags)
    return none unless tags.present?

    joins(:taggings).merge(Tagging.joins(:tag).merge(tags)).distinct
  end

  def favorited_by?(user)
    users_who_favorited.include?(user)
  end
end
