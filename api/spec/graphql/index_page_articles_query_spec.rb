# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'IndexPageArticlesQuery', type: :graphql do
  context 'no data' do
    it { is_expected.to eql(result) }
  end

  context 'with data' do
    before(:each) do
      travel_to Time.local(1994)
      create_list(:article, 20, author: author)
    end

    let(:author) { create(:author, profile: build(:profile)) }
    let(:context) { { current_user: author } }
    let(:variables) { { first: 10 } }

    after(:each) do
      travel_back
    end

    it { is_expected.to eql(result) }
    it { expect(subject['data']['articlesConnection']['edges'].length).to eq(10) }
  end
end
