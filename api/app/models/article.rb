# frozen_string_literal: true

class Article < ApplicationRecord
  before_validation :set_slug, only: %i[create update]
  belongs_to :author, class_name: 'User', validate: true
  has_many :comments, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  validates :body, presence: true
  validates :description, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :title, presence: true

  def self.feed_for(user)
    joins(:users).where(author: user.following)
  end

  def self.tagged_with(name)
    joins(:taggings).where(taggings: { tag: Tag.where(name: name) })
  end

  private

  def set_slug
    return unless title_changed?

    self.slug = "#{title.parameterize}-#{SecureRandom.hex(6)}"
  end
end
