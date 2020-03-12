# frozen_string_literal: true

class CreateFavorites < ActiveRecord::Migration[5.2]
  def change
    create_table :favorites do |t|
      t.belongs_to :article, null: false, foreign_key: true, index: false
      t.belongs_to :user, null: false, foreign_key: true, index: false

      t.timestamps
    end
    # you can only favorite an individual article once
    add_index :favorites, %i[article_id user_id], unique: true
  end
end
