# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tags', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    query TagsQuery {
      tags {
        id
        name
      }
    }
    GRAPHQL
  end

  before(:each) do
    create_list(:tag, 3)
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'tags' => [
            { 'id' => '1', 'name' => 'tag1' },
            { 'id' => '2', 'name' => 'tag2' },
            { 'id' => '3', 'name' => 'tag3' }
          ]
        }
      }
    end
    it { is_expected.to eql result }
  end
end
