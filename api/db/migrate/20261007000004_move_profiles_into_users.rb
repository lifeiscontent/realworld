# frozen_string_literal: true

# The RealWorld user has a bio and an image, so they belong in the users table.
class MoveProfilesIntoUsers < ActiveRecord::Migration[8.1]
  def up
    add_column :users, :bio, :text
    add_column :users, :image, :string

    execute <<~SQL.squish
      UPDATE users
      SET bio = NULLIF(profiles.bio, ''), image = NULLIF(profiles.image_url, '')
      FROM profiles
      WHERE profiles.user_id = users.id
    SQL

    drop_table :profiles
  end

  def down
    create_table :profiles do |t|
      t.text :bio, default: '', null: false
      t.string :image_url
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.timestamps precision: nil
    end

    execute <<~SQL.squish
      INSERT INTO profiles (user_id, bio, image_url, created_at, updated_at)
      SELECT id, COALESCE(bio, ''), image, created_at, updated_at FROM users
    SQL

    remove_column :users, :image
    remove_column :users, :bio
  end
end
