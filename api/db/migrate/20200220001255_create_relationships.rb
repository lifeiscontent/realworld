# frozen_string_literal: true

class CreateRelationships < ActiveRecord::Migration[5.2]
  def change
    create_table :relationships do |t|
      t.belongs_to :followed, null: false, foreign_key: { to_table: :users }, index: false
      t.belongs_to :follower, null: false, foreign_key: { to_table: :users }, index: false

      t.timestamps
    end
    # you can only establish one relationship with someone
    add_index :relationships, %i[followed_id follower_id], unique: true
  end
end
