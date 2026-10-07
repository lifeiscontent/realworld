# frozen_string_literal: true

# FriendlyId uses this table only with its history module. The app does not use it.
class DropFriendlyIdSlugs < ActiveRecord::Migration[8.1]
  def change
    drop_table :friendly_id_slugs do |t|
      t.string :slug, null: false
      t.integer :sluggable_id, null: false
      t.string :sluggable_type, limit: 50
      t.string :scope
      t.datetime :created_at
      t.index %i[slug sluggable_type scope], unique: true
      t.index %i[slug sluggable_type]
      t.index %i[sluggable_type sluggable_id]
    end
  end
end
