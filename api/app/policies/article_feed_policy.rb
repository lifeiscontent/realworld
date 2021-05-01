# frozen_string_literal: true

class ArticleFeedPolicy < ApplicationPolicy
  relation_scope do |relation|
    if user.instance_of?(User)
      relation.where(author: user.following.pluck(:id))
    else
      relation.none
    end
  end
end
