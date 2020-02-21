# frozen_string_literal: true

class CreateRelationships < ActiveRecord::Migration[5.2]
  def change
    create_table :relationships do |t|
      t.belongs_to :follower, null: false
      t.belongs_to :followed, null: false

      t.timestamps
    end
    add_index :relationships, %i[follower_id followed_id], unique: true
  end
end
