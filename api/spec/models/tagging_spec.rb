# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Tagging, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:article).validate }
    it { is_expected.to belong_to(:tag).counter_cache(true).validate }
  end

  describe 'validations' do
    subject { create(:tagging, article:, tag:) }

    let(:article) { create(:article, author: create(:author)) }
    let(:tag) { create(:tag) }

    it { is_expected.to validate_uniqueness_of(:tag_id).scoped_to(:article_id) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:article_id).with_options(null: false) }
    it { is_expected.to have_db_column(:tag_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(%i[article_id tag_id]).unique }
    it { is_expected.to have_db_index(:tag_id) }
  end
end
