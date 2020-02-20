# frozen_string_literal: true

class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.string :slug, null: false
      t.string :title, null: false
      t.string :description, null: false
      t.text :body, null: false
      t.integer :favorites_count, null: false, default: 0
      t.belongs_to :profile, null: false, foreign_key: true

      t.timestamps
    end
    add_index :articles, :slug, unique: true
  end
end
