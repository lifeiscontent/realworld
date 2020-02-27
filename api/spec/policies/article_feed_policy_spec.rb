# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ArticleFeedPolicy, type: :policy do
  describe 'relation scope' do
    let(:author) { create(:author) }
    let(:user) { create(:user) }
    let(:context) { { user: user } }

    before do
      user.follow(author)
      create(:article, author: user)
      create(:article, author: author)
    end

    subject { policy.apply_scope(Article.all, type: :active_record_relation) }

    context 'as user' do
      it { expect(subject.length).to eq 1 }
    end

    context 'as someone else' do
      let(:context) { { user: create(:user) } }
      it { expect(subject.length).to eq 0 }
    end
  end
end
