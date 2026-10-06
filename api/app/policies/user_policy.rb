# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  # Users cannot follow themselves. Following again has no effect.
  def follow?
    another_user?
  end

  def unfollow?
    another_user?
  end

  private

  def another_user?
    user? && user.id != record.id
  end
end
