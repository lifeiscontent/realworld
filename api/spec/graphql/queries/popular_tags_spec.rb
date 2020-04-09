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

  let!(:tags) { create_list(:tag, 3) }

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          popularTags: []
        }
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is not defined and article has tag' do
    let!(:article) { create(:article, tags: [tags.first], author: build(:author)) }
    let(:result) do
      {
        data: {
          popularTags: article.tags.map { |tag| { id: tag.id.to_s, name: tag.name } }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
