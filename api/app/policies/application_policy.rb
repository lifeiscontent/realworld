# frozen_string_literal: true

# The base class of the policies. A guest has no user.
class ApplicationPolicy < ActionPolicy::Base
  authorize :user, allow_nil: true

  private

  def user?
    user.present?
  end
end
