# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CommentPolicy, type: :policy do
  let(:article_author) { build_stubbed(:author) }
  let(:article) { build_stubbed :article, author: article_author }
  let(:author) { build_stubbed(:author) }
  let(:context) { { user: current_user } }
  let(:current_user) { nil }
  let(:record) { build_stubbed :comment, author:, article: }
  let(:user) { build_stubbed(:user) }

  describe_rule :create? do
    failed 'when user is not logged in'
    succeed 'when user is logged in' do
      let(:current_user) { user }
    end
  end

  describe_rule :delete? do
    failed 'when user is not logged in'
    failed 'when user is not author' do
      let(:current_user) { user }
    end
    succeed 'when user is author' do
      let(:current_user) { author }
    end
    succeed 'when user is article author' do
      let(:current_user) { article_author }
    end
  end
end
