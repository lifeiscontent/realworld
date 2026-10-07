# frozen_string_literal: true

module Sources
  # Loads, in one query, which of many users the user follows.
  class Following < GraphQL::Dataloader::Source
    def initialize(user)
      super()
      @user = user
    end

    def fetch(user_ids)
      followed = Relationship.where(follower: @user, followed_id: user_ids).pluck(:followed_id).to_set
      user_ids.map { |id| followed.include?(id) }
    end
  end
end
