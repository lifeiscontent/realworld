# frozen_string_literal: true

class Profile < ApplicationRecord
  belongs_to :user
  has_many :active_relationships, class_name: 'Relationship',
                                  foreign_key: 'follower_id',
                                  dependent: :destroy
  has_many :passive_relationships, class_name: 'Relationship',
                                   foreign_key: 'followed_id',
                                   dependent: :destroy
  has_many :following, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower
  has_many :articles, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :favorites, through: :user
  has_many :favorite_articles, through: :favorites, source: :article

  def follow(profile)
    following << profile
  end

  def unfollow(profile)
    following.delete(profile)
  end

  def following?(profile)
    following.include?(profile)
  end
end
