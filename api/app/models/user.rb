# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :profile, autosave: true, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorite_articles, through: :favorites, source: :article
  has_many :active_relationships, class_name: 'Relationship',
                                  foreign_key: 'follower_id',
                                  dependent: :destroy
  has_many :passive_relationships, class_name: 'Relationship',
                                   foreign_key: 'followed_id',
                                   dependent: :destroy
  has_many :following, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower
  has_many :articles, foreign_key: 'author_id', dependent: :destroy
  has_many :comments, foreign_key: 'author_id', dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorite_articles, through: :favorites, source: :article

  def favorited?(article)
    favorite_articles.include? article
  end

  def unfavorited?(article)
    favorite_articles.exclude? article
  end

  def favorite(article)
    favorite_articles << article
    favorited? article.reload
  rescue ActiveRecord::RecordInvalid
    false
  end

  def unfavorite(article)
    favorite_articles.destroy(article)

    unfavorited? article.reload
  end

  def following?(user)
    following.include? user
  end

  def unfollowing?(user)
    following.exclude? user
  end

  def follow(user)
    following << user
    following? user.reload
  end

  def unfollow(user)
    following.destroy(user)
    unfollowing? user.reload
  end

  def self.from_jwt(token)
    jwt_payload = JWT.decode(
      token,
      Rails.application.secrets.secret_key_base
    ).first
    User.find(jwt_payload['id'])
  rescue JWT::ExpiredSignature,
         JWT::VerificationError,
         JWT::DecodeError
    nil
  end

  def generate_jwt
    JWT.encode(
      {
        id: id,
        exp: 24.hours.from_now.to_i
      }, Rails.application.secrets.secret_key_base
    )
  end
end
