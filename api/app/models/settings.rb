# frozen_string_literal: true

class Settings
  include ActiveModel::Model
  include ActiveModel::Dirty
  include ActiveModel::Callbacks

  attr_reader :username, :email, :password, :bio, :image_url, :user, :profile

  delegate :id, to: :user, prefix: true
  delegate :id, to: :profile, prefix: true

  define_attribute_methods :username, :email, :password, :bio, :image_url
  define_model_callbacks :save, only: [:around]

  around_save :check_valid

  def user=(user)
    @user = user
    self.profile = user.profile
    @user.email = email if email.present?
    @user.password = password if password.present?
  end

  def profile=(profile)
    @profile = profile
    @profile.bio = bio
    @profile.image_url = image_url
  end

  def email=(email)
    return if email == @email || email.nil?

    email_will_change!
    @email = email
    user&.email = email
  end

  def password=(password)
    return if password == @password || password.nil?

    password_will_change!
    @password = password
    user&.password = password
  end

  def username=(username)
    return if username == @username || username.nil?

    username_will_change!
    @username = username
    profile.username = username if profile.present?
  end

  def bio=(bio)
    return if bio == @bio

    bio_will_change!
    @bio = bio
    profile.bio = bio if profile.present?
  end

  def image_url=(image_url)
    return if image_url == @image_url

    image_url_will_change!
    @image_url = image_url
    profile.image_url = image_url if profile.present?
  end

  def save
    run_callbacks :save do
      changes_applied
      user.save
    end
  end

  def reload!
    clear_changes_information
  end

  def rollback!
    restore_attributes
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

  # used to trigger validations in profile and user
  def check_valid
    yield

    valid?
  end
end
