# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CommentPolicy, type: :policy do
  let(:article_author) { create(:author) }
  let(:comment_author) { create(:author) }
  let(:article) { create(:article, author: article_author) }
  let(:record) { create(:comment, article:, author: comment_author) }
  let(:context) { { user: current_user } }

  describe_rule :delete? do
    failed 'when user is a guest' do
      let(:current_user) { nil }
    end

    failed 'when user is another user' do
      let(:current_user) { create(:user) }
    end

    succeed 'when user wrote the comment' do
      let(:current_user) { comment_author }
    end

    succeed 'when user wrote the article' do
      let(:current_user) { article_author }
    end
  end
end
