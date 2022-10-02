# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :profile, autosave: true, dependent: :destroy, validate: true
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
  accepts_nested_attributes_for :profile
  validates_presence_of :username, :encrypted_password, :followers_count, :following_count
  validates_uniqueness_of :username

  def self.from_jwt(token)
    jwt_payload = JWT.decode(
      token,
      Rails.application.credentials[:secret_key_base]
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
        id:,
        exp: 24.hours.from_now.to_i
      }, Rails.application.credentials[:secret_key_base]
    )
  end

  def self.find_for_authentication(tainted_conditions)
    super || new
  end

  def authenticate!(password)
    errors.add(:base, 'Email or password is invalid') unless valid_password?(password)

    raise ActiveModel::ValidationError, self if errors.any?

    errors.none?
  end
end
