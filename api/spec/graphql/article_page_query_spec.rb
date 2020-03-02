# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ArticlePageQuery', type: :graphql do
  context 'no data' do
    it { is_expected.to eql(result) }
  end

  context 'with data' do
    before(:each) do
      travel_to Time.local(1994)
    end

    let(:article) { create(:article, author: author) }
    let(:author) { create(:user, profile: build(:profile)) }
    let(:variables) { { slug: article.slug } }

    after(:each) do
      travel_back
    end

    it { is_expected.to eql(result) }

    context 'with viewer' do
      let(:context) { { current_user: author } }

      it { is_expected.to eql(result) }
    end
  end
end
