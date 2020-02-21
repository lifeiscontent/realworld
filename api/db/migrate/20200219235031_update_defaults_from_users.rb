# frozen_string_literal: true

class UpdateDefaultsFromUsers < ActiveRecord::Migration[5.2]
  def change
    change_column_default :users, :email, nil
    change_column_default :users, :encrypted_password, nil
  end
end
