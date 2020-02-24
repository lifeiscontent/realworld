# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def follow?
    user? && user.id != record.id
  end

  def unfollow?
    user? && user.id != record.id
  end

  def update?
    owner?
  end

  def owner?
    user? && user.id == record.id
  end
end
