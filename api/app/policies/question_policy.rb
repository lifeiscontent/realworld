# frozen_string_literal: true

class QuestionPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    user?
  end

  def update?
    author?
  end

  def delete?
    author?
  end

  private

  def author?
    user? && record.author_id == user.id
  end
end
