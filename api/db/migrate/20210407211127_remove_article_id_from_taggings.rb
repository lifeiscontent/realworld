# frozen_string_literal: true

class RemoveArticleIdFromTaggings < ActiveRecord::Migration[6.1]
  def up
    remove_column :taggings, :article_id, :bigint
    if index_exists?(:taggings, %i[article_id tag_id], unique: true) do
      remove_index :taggings, %i[article_id tag_id], unique: true
    end
  end

  def down
    add_column :taggings, :article_id, :bigint, null: false
    add_index :taggings, %i[article_id tag_id], unique: true
  end
end