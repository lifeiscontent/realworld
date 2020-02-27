# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SettingsPolicy, type: :policy do
  let(:current_user) { nil }
  let(:user) { build_stubbed(:user, profile: build_stubbed(:profile)) }
  let(:owner) { build_stubbed(:user, profile: build_stubbed(:profile)) }
  let(:record) { Settings.new(user: owner) }
  let(:context) { { user: current_user } }

  describe_rule :update? do
    failed 'when user is not logged in'

    failed 'when user is not owner' do
      let(:current_user) { user }
    end

    succeed 'when user is not owner' do
      let(:current_user) { owner }
    end
  end
end
