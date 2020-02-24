# frozen_string_literal: true

class Registration
  include ActiveModel::Model
  include ActiveModel::Callbacks

  delegate :email, :email=, :pasword, :password=, to: :user
  delegate :username, :username=, to: :profile

  define_model_callbacks :save, only: [:around]

  around_save :check_valid

  def user
    @user ||= User.new
  end

  def profile
    @profile ||= user.build_profile
  end

  def save
    run_callbacks :save do
      user.save
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

  private

  # used to trigger validations in profile and user
  def check_valid
    yield

    valid?
  end
end
