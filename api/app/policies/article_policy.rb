# frozen_string_literal: true

class ArticlePolicy < ApplicationPolicy
  relation_scope do |relation|
    if user.class.name == 'User'
      relation.where(author: user.following.pluck(:id))
    else
      relation.none
    end
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

  def favorite?
    user_not_author?
  end

  def unfavorite?
    user_not_author?
  end

  def author?
    user? && record.author_id == user.id
  end

  def user_not_author?
    user? && record.author_id != user.id
  end
end
