# frozen_string_literal: true

class ArticlePolicy < ApplicationPolicy
  def create?
    user?
  end

  def update?
    author?
  end

  def delete?
    author?
  end

  def favorite?
    user_not_author?
  end

  def unfavorite?
    user_not_author?
  end

  private

  def author?
    user? && record.author_id == user.id
  end

  def user_not_author?
    user? && record.author_id != user.id
  end
end
