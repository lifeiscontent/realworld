# frozen_string_literal: true

class Registration
  include ActiveModel::Model

  delegate :email, :email=, :pasword, :password=, to: :user
  delegate :username, :username=, to: :profile

  def user
    @user ||= User.new
  end

  def profile
    @profile ||= user.build_profile
  end

  def save
    if valid?
      user.save
    else
      false
    end
  end

  validate do |registration|
    registration.user.tap(&:valid?).errors.full_messages.each do |message|
      errors.add(:user, message)
    end

    registration.profile.tap(&:valid?).errors.full_messages.each do |message|
      errors.add(:profile, message)
    end
  end
end
