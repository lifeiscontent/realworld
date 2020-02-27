# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'SettingsPageUpdateSettingsMutation', type: :graphql do
  context 'no data' do
    it { is_expected.to eq(result) }
  end
end
