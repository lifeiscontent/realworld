# frozen_string_literal: true

# The unique indexes start with the other column, so these lookups need their own index.
class AddForeignKeyIndexes < ActiveRecord::Migration[8.1]
  def change
    add_index :relationships, :follower_id
    add_index :favorites, :user_id
    add_index :taggings, :tag_id
  end
end
