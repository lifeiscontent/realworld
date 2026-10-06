# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserPolicy, type: :policy do
  let(:record) { create(:user) }
  let(:context) { { user: current_user } }

  %i[follow? unfollow?].each do |rule|
    describe_rule rule do
      failed 'when user is a guest' do
        let(:current_user) { nil }
      end

      failed 'when user is the same user' do
        let(:current_user) { record }
      end

      succeed 'when user is another user' do
        let(:current_user) { create(:user) }
      end
    end
  end
end
