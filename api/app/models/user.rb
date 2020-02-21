# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :profile, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorite_articles, through: :favorites, source: :article

  def favorite_article(article)
    favorite_articles << article
  end

  def unfavorite_article(article)
    favorite_articles.delete(article)
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
