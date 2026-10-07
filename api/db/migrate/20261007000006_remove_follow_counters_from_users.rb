# frozen_string_literal: true

# The schema does not show follower counts, so the counter caches are not necessary.
class RemoveFollowCountersFromUsers < ActiveRecord::Migration[8.1]
  def change
    remove_column :users, :followers_count, :integer, default: 0, null: false
    remove_column :users, :following_count, :integer, default: 0, null: false
  end
end
