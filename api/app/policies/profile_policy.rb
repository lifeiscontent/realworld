# frozen_string_literal: true

class ProfilePolicy < ApplicationPolicy
  def update?
    owner?
  end

  private

  def owner?
    user? && user.profile.id == record.id
  end
end
