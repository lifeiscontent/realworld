# frozen_string_literal: true

class ArticleFeedPolicy < ApplicationPolicy
  scope_for :active_record_relation do |scope|
    if user.instance_of?(User)
      scope.where(author: user.following.pluck(:id))
    else
      scope.none
    end
  end
end
