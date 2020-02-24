# frozen_string_literal: true

class UpdateDefaultsFromUsers < ActiveRecord::Migration[5.2]
  def change
    change_column_default :users, :email, nil
    change_column_default :users, :encrypted_password, nil
    add_column :users, :followers_count, :integer, null: false, default: 0
    add_column :users, :following_count, :integer, null: false, default: 0
  end
end
