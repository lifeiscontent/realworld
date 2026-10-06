# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ArticlePolicy, type: :policy do
  let(:author) { create(:author) }
  let(:record) { create(:article, author:) }
  let(:context) { { user: current_user } }

  %i[update? delete?].each do |rule|
    describe_rule rule do
      failed 'when user is a guest' do
        let(:current_user) { nil }
      end

      failed 'when user is not the author' do
        let(:current_user) { create(:user) }
      end

      succeed 'when user is the author' do
        let(:current_user) { author }
      end
    end
  end
end
