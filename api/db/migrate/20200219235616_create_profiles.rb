# frozen_string_literal: true

class CreateProfiles < ActiveRecord::Migration[5.2]
  def change
    create_table :profiles do |t|
      t.text :bio, null: false, default: ''
      t.string :image_url
      t.belongs_to :user, null: false, index: { unique: true }, foreign_key: true
      t.timestamps
    end
  end
end
