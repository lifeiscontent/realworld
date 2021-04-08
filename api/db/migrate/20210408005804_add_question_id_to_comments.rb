class AddQuestionIdToComments < ActiveRecord::Migration[6.1]
  def change
    change_table :comments do |t|
      t.belongs_to :question, null: false, foreign_key: true
    end
  end
end