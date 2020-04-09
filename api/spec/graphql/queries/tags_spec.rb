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

  let!(:tags) { create_list(:tag, 3) }

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          tags: tags.map { |tag| { id: tag.id.to_s, name: tag.name } }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
