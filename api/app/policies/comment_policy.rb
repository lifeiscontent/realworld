# frozen_string_literal: true

class CommentPolicy < ApplicationPolicy
  def create?
    user?
  end

  def delete?
    owner? || article_author?
  end

  private

  def owner?
    user? && record.author_id == user.id
  end

  def article_author?
    user? && record.article.author_id == user.id
  end
end
