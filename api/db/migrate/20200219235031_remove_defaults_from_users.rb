# frozen_string_literal: true

class RemoveDefaultsFromUsers < ActiveRecord::Migration[5.2]
  def change
    change_column_default :users, :email, nil
    change_column_default :users, :encrypted_password, nil
  end
end
