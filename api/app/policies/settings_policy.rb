# frozen_string_literal: true

class SettingsPolicy < ApplicationPolicy
  def update?
    owner?
  end
end
