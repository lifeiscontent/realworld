# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ArticlePolicy, type: :policy do
  let(:current_user) { nil }
  let(:author) { create(:author) }
  let(:user) { create(:user) }
  let(:record) { create(:article, author:) }
  let(:context) { { user: current_user } }

  describe_rule :create? do
    failed 'when user is not logged in'

    succeed 'when user is logged in' do
      let(:current_user) { user }
    end
  end

  %i[update? delete?].each do |rule|
    describe_rule rule do
      failed 'when user is not logged in'
      failed 'when user is not author' do
        let(:current_user) { user }
      end

      succeed 'when user is author' do
        let(:current_user) { author }
      end
    end
  end

  describe_rule :favorite? do
    succeed 'when user is not author and has not favorited' do
      let(:current_user) { user }
    end

    failed 'when user is author' do
      let(:current_user) { author }
    end
  end

  describe_rule :unfavorite? do
    succeed 'when user is not author and has favorited' do
      let(:favorite) { create(:favorite, article: record, user:) }
      let(:current_user) { favorite.user }
    end

    failed 'when user is author' do
      let(:current_user) { author }
    end
  end
end
