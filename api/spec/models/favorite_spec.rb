# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Favorite, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:article).counter_cache }
    it { is_expected.to belong_to(:user).validate }
  end

  describe '.create_or_find_by!' do
    let(:user) { create(:user) }
    let(:article) { create(:article, author: create(:author)) }

    it 'returns the existing favorite for a second call' do
      first = described_class.create_or_find_by!(user:, article:)

      expect(described_class.create_or_find_by!(user:, article:)).to eq(first)
      expect(article.reload.favorites_count).to eq(1)
    end
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:article_id).with_options(null: false) }
    it { is_expected.to have_db_column(:user_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(%i[article_id user_id]).unique }
    it { is_expected.to have_db_index(:user_id) }
  end
end
