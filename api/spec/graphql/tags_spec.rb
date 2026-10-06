# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Tags', type: :graphql do
  describe 'tags (GET /api/tags)' do
    it 'returns the names of the tags in use, most used first' do
      create(:tag, name: 'unused')
      create(:article, author: create(:author), tags: [create(:tag, name: 'dragons'), create(:tag, name: 'angular')])
      create(:article, author: create(:author), tags: Tag.where(name: 'dragons'))

      expect(execute('{ tags }')).to eq(data: { tags: %w[dragons angular] })
    end
  end
end
