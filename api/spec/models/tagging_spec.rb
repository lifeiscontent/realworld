# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Tagging, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:article).validate }
    it { is_expected.to belong_to(:tag).counter_cache(true).validate }
  end

  describe 'validations' do
    let(:article) { create(:article, author: create(:author)) }
    let(:tag) { create(:tag) }

    subject { create(:tagging, article: article, tag: tag) }

    it { is_expected.to validate_uniqueness_of(:article_id).scoped_to(:tag_id) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:article_id).with_options(null: false) }
    it { is_expected.to have_db_column(:tag_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:article_id) }
    it { is_expected.to have_db_index(:tag_id) }
    it { is_expected.to have_db_index(%i[article_id tag_id]).unique }
  end
end
