# frozen_string_literal: true

# has_secure_password reads the bcrypt hash from password_digest. Devise used no
# pepper, so the hashes in encrypted_password stay valid.
class ReplaceDeviseColumns < ActiveRecord::Migration[8.1]
  def change
    rename_column :users, :encrypted_password, :password_digest
    remove_index :users, :reset_password_token, unique: true
    remove_column :users, :reset_password_token, :string
    remove_column :users, :reset_password_sent_at, :datetime, precision: nil
    remove_column :users, :remember_created_at, :datetime, precision: nil
  end
end
