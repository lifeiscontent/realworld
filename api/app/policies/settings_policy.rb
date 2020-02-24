# frozen_string_literal: true

class SettingsPolicy < ApplicationPolicy
  def update?
    owner?
  end

  def owner?
    user? && user.id == record.user_id
  end
end
