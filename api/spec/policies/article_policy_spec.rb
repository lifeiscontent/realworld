# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ArticlePolicy, type: :policy do
  let(:current_user) { nil }
  let(:author) { build_stubbed(:author) }
  let(:user) { build_stubbed(:user) }
  let(:record) { build_stubbed(:article, author: author) }
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

  %i[favorite? unfavorite?].each do |rule|
    describe_rule rule do
      succeed 'when user is not author' do
        let(:current_user) { user }
      end

      failed 'when user is author' do
        let(:current_user) { author }
      end
    end
  end
end
