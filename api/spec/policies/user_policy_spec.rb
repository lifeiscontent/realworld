# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserPolicy, type: :policy do
  let(:context) { { user: current_user } }
  let(:current_user) { nil }
  let(:record) { owner }
  let(:user) { create(:user) }
  let(:owner) { create(:user) }

  describe_rule :follow? do
    failed 'when user is not logged in'

    failed 'when user is themself' do
      let(:current_user) { owner }
    end

    succeed 'when user is not themself' do
      let(:current_user) { user }
    end
  end

  describe_rule :unfollow? do
    failed 'when user is not logged in'

    failed 'when user is themself' do
      let(:current_user) { owner }
    end

    failed 'when user is not themself' do
      let(:current_user) { user }
    end

    succeed 'when user is a follower' do
      let(:current_user) { create(:relationship, follower: user, followed: owner).follower }
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
