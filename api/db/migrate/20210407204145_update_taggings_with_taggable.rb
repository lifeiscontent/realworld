# frozen_string_literal: true

class UpdateTaggingsWithTaggable < ActiveRecord::Migration[6.1]
  def change
    add_column :taggings, :taggable_id, :bigint, null: false
    add_column :taggings, :taggable_type, :string, null: false
    add_index :taggings, %i[tag_id taggable_id taggable_type], unique: true
  end
end
