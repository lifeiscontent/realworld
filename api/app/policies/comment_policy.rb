# frozen_string_literal: true

class CommentPolicy < ApplicationPolicy
  def create?
    user?
  end
end
