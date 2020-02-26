# frozen_string_literal: true

class Session
  include ActiveModel::Model

  attr_writer :password
  attr_reader :token, :user, :email

  def email=(email)
    @email = email
    @user = User.find_for_authentication(email: email)
  end

  def save
    if valid?
      @token = user.generate_jwt
      true
    else
      false
    end
  end

  validate do |session|
    next if session.user&.valid_password?(password)

    @token = nil if @token.present?

    errors.add(:base, 'Email or password is invalid')
  end

  private

  attr_reader :password
end
