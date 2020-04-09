# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tag', type: :graphql do
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
        data: {
          tag: {
            id: tag.id.to_s,
            name: tag.name
          }
        }
      }
    end
    it { is_expected.to eql result }
  end
end
