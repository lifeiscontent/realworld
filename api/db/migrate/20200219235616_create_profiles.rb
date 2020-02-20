# frozen_string_literal: true

class CreateProfiles < ActiveRecord::Migration[5.2]
  def change
    create_table :profiles do |t|
      t.string :username
      t.text :bio, null: false, default: ''
      t.string :image
      t.belongs_to :user, index: { unique: true }, foreign_key: true

      t.timestamps
    end
    add_index :profiles, :username, unique: true
  end
end
