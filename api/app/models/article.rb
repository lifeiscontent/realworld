# frozen_string_literal: true

class Article < ApplicationRecord
  belongs_to :author, class_name: 'User', foreign_key: 'user_id'
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  has_many :comments, dependent: :destroy
  has_many :favorites, dependent: :destroy
  before_validation :set_slug, only: %i[create update]

  validates :slug, presence: true
  validates :title, presence: true
  validates :description, presence: true
  validates :body, presence: true

  def self.feed_for(user)
    joins(:users).where(author: user.following)
  end

  def self.tagged_with(name)
    joins(:taggings).where(taggings: { tag: Tag.where(name: name) })
  end

  def set_slug
    return unless title_changed?

    self.slug = "#{title.parameterize}-#{SecureRandom.hex(6)}"
  end
end
