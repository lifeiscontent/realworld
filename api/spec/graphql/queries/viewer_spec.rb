# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'viewer', type: :graphql do
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
        data: {
          viewer: nil
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is user' do
    let(:current_user) { user }
    let(:result) do
      {
        data: {
          viewer: {
            username: user.username
          }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
