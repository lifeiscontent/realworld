# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:articles).through(:taggings) }
    it { is_expected.to have_many(:taggings).dependent(:destroy) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:name).with_options(null: false) }
    it { is_expected.to have_db_column(:taggings_count).with_options(default: 0, null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:name).unique }
  end

  describe 'methods' do
    subject { described_class }

    it { expect(subject.most_used(10)).to be_a(ActiveRecord::Relation) }
  end
end
