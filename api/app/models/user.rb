# frozen_string_literal: true

class User < ApplicationRecord
  JWT_ALGORITHM = 'HS256'
  JWT_LIFETIME = 24.hours
  IMAGE_URL = /\A#{URI::RFC2396_PARSER.make_regexp(%w[http https])}\z/

  has_secure_password

  has_many :active_relationships, class_name: 'Relationship', foreign_key: 'follower_id', dependent: :destroy,
                                  inverse_of: :follower
  has_many :passive_relationships, class_name: 'Relationship', foreign_key: 'followed_id', dependent: :destroy,
                                   inverse_of: :followed
  has_many :articles, foreign_key: 'author_id', dependent: :destroy, inverse_of: :author
  has_many :comments, foreign_key: 'author_id', dependent: :destroy, inverse_of: :author
  has_many :favorites, dependent: :destroy
  has_many :favorite_articles, through: :favorites, source: :article
  has_many :followers, through: :passive_relationships, source: :follower
  has_many :following, through: :active_relationships, source: :followed

  normalizes :email, with: ->(email) { email.strip.downcase }
  normalizes :username, with: ->(username) { username.strip }

  validates :email, presence: true
  validates :email, uniqueness: true, format: { with: /\A[^@\s]+@[^@\s]+\z/ }, allow_blank: true
  validates :username, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, allow_nil: true
  validates :image, format: { with: IMAGE_URL }, allow_blank: true

  # Returns the user of a valid token, or nil.
  def self.from_jwt(token)
    payload, = JWT.decode(token, jwt_key, true, algorithm: JWT_ALGORITHM)
    find_by(id: payload['id'])
  rescue JWT::DecodeError
    nil
  end

  def self.jwt_key
    Rails.application.key_generator.generate_key('jwt')
  end

  def generate_jwt
    JWT.encode({ id:, exp: JWT_LIFETIME.from_now.to_i }, self.class.jwt_key, JWT_ALGORITHM)
  end
end
