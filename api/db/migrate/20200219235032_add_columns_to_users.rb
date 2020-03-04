class AddColumnsToUsers < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :followers_count, :integer, default: 0
    add_column :users, :following_count, :integer, default: 0
    add_column :users, :username, :string

    change_column_null :users, :followers_count, false
    change_column_null :users, :following_count, false
    change_column_null :users, :username, false
    add_index :users, :username, unique: true
  end

  def down
    remove_index :users, :username
    remove_column :users, :followers_count, :integer
    remove_column :users, :following_count, :integer
    remove_column :users, :username, :string
  end
end
