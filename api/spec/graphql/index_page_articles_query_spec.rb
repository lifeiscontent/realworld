# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'IndexPageArticlesQuery', type: :graphql do
  context 'no data' do
    it { is_expected.to eq(result) }
  end

  context 'with data' do
    before do
      travel_to Time.local(1994)
    end

    after do
      travel_back
    end

    before(:each) do
      create_list(:article, 20, author: author)
    end

    let(:author) { create(:author, profile: build(:profile)) }
    let(:context) { { current_user: author } }
    let(:variables) { { first: 10 } }

    it { is_expected.to eq(result) }
    it { expect(subject['data']['articlesConnection']['edges'].length).to eq(10) }
  end
end
