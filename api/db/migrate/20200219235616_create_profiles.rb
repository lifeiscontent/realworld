# frozen_string_literal: true

class CreateProfiles < ActiveRecord::Migration[5.2]
  def change
    create_table :profiles do |t|
      t.string :username, index: { unique: true }
      t.text :bio, null: false, default: ''
      t.string :image_url
      t.belongs_to :user, null: false, index: { unique: true }, foreign_key: true
      t.integer :followers_count, null: false, default: 0
      t.integer :following_count, null: false, default: 0

      t.timestamps
    end
  end
end
