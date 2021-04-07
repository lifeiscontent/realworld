# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Tagging, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:taggable).validate }
    it { is_expected.to belong_to(:tag).counter_cache(true).validate }
  end

  describe 'validations' do
    let(:taggable) { create(:question, author: create(:author)) }
    let(:tag) { create(:tag) }

    subject { create(:tagging, taggable: taggable, tag: tag) }

    it { is_expected.to validate_uniqueness_of(:tag_id).scoped_to(:taggable_id, :taggable_type) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:taggable_id).with_options(null: false) }
    it { is_expected.to have_db_column(:taggable_type).with_options(null: false) }
    it { is_expected.to have_db_column(:tag_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(%i[tag_id taggable_id taggable_type]).unique }
  end
end
