# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserPolicy, type: :policy do
  let(:context) { { user: current_user } }
  let(:current_user) { nil }
  let(:record) { owner }
  let(:user) { build_stubbed(:user) }
  let(:owner) { build_stubbed(:user) }

  %i[follow? unfollow?].each do |rule|
    describe_rule rule do
      failed 'when user is not logged in'

      failed 'when user is themself' do
        let(:current_user) { owner }
      end

      succeed 'when user is not themself' do
        let(:current_user) { user }
      end
    end
  end

  describe_rule :update? do
    failed 'when user is not logged in'
    failed 'when user is not themself' do
      let(:current_user) { user }
    end
    succeed 'when user is themself' do
      let(:current_user) { owner }
    end
  end
end
