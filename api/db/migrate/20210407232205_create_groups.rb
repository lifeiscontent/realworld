class CreateGroups < ActiveRecord::Migration[6.1]
  def change
    create_table :groups do |t|
      t.string :name, null: false, index: { unique: true }
      t.integer :memberships_count, null: false, default: 0
      t.timestamps
    end
  end
end
