# frozen_string_literal: true

class Settings
  include ActiveModel::Model

  attr_writer :user

  delegate :id, to: :user, prefix: true
  delegate :email, :email=, :password=, :profile, :profile=, to: :user
  delegate :username, :username=, :bio, :bio=, :image_url, :image_url=, to: :profile

  def user
    @user ||= User.new.tap(&:build_profile)
  end

  def save
    if valid?
      user.save
    else
      false
    end
  end

  validate do |settings|
    settings.user.tap(&:valid?).errors.full_messages.each do |message|
      errors.add(:user, message)
    end
    settings.user.profile.tap(&:valid?).errors.full_messages.each do |message|
      errors.add(:profile, message)
    end
  end

  private

  def password
    user.password
  end
end
