# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'popularTags', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    query PopularTagsQuery {
      popularTags {
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
          'popularTags' => []
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is not defined and article has tag' do
    before(:each) do
      create(:article, tags: Tag.limit(1), author: build(:author))
    end
    let(:result) do
      {
        'data' => {
          'popularTags' => [
            { 'id' => '1', 'name' => 'tag1' }
          ]
        }
      }
    end
    it { is_expected.to eql result }
  end
end
