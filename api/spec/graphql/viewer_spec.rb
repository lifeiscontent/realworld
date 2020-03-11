# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'viewer', type: :graphql do
  before(:each) do
    travel_to Time.zone.local(1994)
  end
  after(:each) do
    travel_back
  end

  let(:query) do
    <<-GRAPHQL
    query ViewerQuery {
      viewer {
        username
      }
    }
    GRAPHQL
  end
  let(:user) { create(:user, profile: build(:profile)) }

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'viewer' => nil
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is user' do
    let(:current_user) { user }
    let(:result) do
      {
        'data' => {
          'viewer' => {
            'username' => 'user1',
          }
        }
      }
    end
    it { is_expected.to eql result }
  end

end
