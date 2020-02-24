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

  def favorite?
    user? && record.user_id != user.id
  end

  def unfavorite?
    user? && record.user_id != user.id
  end
end
