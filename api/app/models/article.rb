# frozen_string_literal: true

class Article < ApplicationRecord
  extend FriendlyId

  friendly_id :title, use: :slugged
  belongs_to :author, class_name: 'User', validate: true
  has_many :comments, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  has_many :users_who_favorited, through: :favorites, source: :user
  validates :body, :description, :slug, :title, presence: true
  validates :slug, uniqueness: true

  def self.tagged_with(tags)
    where(id: Tagging.where(tag: tags).select(:article_id))
  end

  # The RealWorld API changes the slug when an update changes the title.
  def should_generate_new_friendly_id?
    (persisted? && title_changed?) || super
  end
end
