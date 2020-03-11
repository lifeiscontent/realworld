# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tag', type: :graphql do
  before(:each) do
    travel_to Time.zone.local(1994)
  end
  after(:each) do
    travel_back
  end

  let(:query) do
    <<-GRAPHQL
    query TagQuery($id: ID!) {
      tag(id: $id) {
        id
        name
      }
    }
    GRAPHQL
  end
  let(:tag) { create(:tag) }
  let(:variables) do
    {
      id: tag.id
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'tag' => {
            'id' => '1',
            'name' => 'tag1'
          }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
