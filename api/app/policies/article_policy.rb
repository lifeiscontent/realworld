# frozen_string_literal: true

class ArticlePolicy < ApplicationPolicy
  relation_scope do |relation|
    if user.class.name == 'User'
      return relation.where(
        author: user.profile.following.pluck(:id)
      )
    end

    relation.none
  end
end
