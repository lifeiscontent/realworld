# frozen_string_literal: true

class CreateComments < ActiveRecord::Migration[5.2]
  def change
    create_table :comments do |t|
      t.belongs_to :author, null: false, foreign_key: { to_table: :users }
      t.belongs_to :article, null: false, foreign_key: true
      t.text :body, null: false

      t.timestamps
    end
  end
end
