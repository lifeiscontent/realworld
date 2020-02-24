# frozen_string_literal: true

class Session
  include ActiveModel::Model
  include ActiveModel::Dirty
  include ActiveModel::Callbacks

  define_attribute_methods :email, :password
  define_model_callbacks :email_will_change, only: [:after]
  after_email_will_change :set_user

  attr_reader :email, :password, :user, :token

  def email=(email)
    return if email == @email

    run_callbacks :email_will_change do
      email_will_change!
      @email = email
    end
  end

  def password=(password)
    return if password == @password

    password_will_change!
    @password = password
  end

  def save
    if valid?
      @token = user.generate_jwt
      changes_applied
      true
    else
      false
    end
  end

  def reload!
    clear_changes_information
  end

  def rollback!
    restore_attributes
  end

  validate do |session|
    next if session.user&.valid_password?(password)

    @token = nil if @token.present?

    errors.add(:base, 'Email or password is invalid')
  end

  private

  def set_user
    @user = User.find_for_authentication(email: email)
  end
end
