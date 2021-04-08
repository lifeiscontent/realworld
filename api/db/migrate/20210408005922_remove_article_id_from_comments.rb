class RemoveArticleIdFromComments < ActiveRecord::Migration[6.1]
  def change
    remove_column :comments, :article_id, :bigint, null: false
  end
end
