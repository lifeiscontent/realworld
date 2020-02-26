# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:author).class_name('User').validate }
    it { is_expected.to have_many(:comments).dependent(:destroy) }
    it { is_expected.to have_many(:favorites).dependent(:destroy) }
    it { is_expected.to have_many(:taggings).dependent(:destroy) }
    it { is_expected.to have_many(:tags).through(:taggings) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:body) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:slug) }
    it { is_expected.to validate_presence_of(:title) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:slug).with_options(null: false) }
    it { is_expected.to have_db_column(:title).with_options(null: false) }
    it { is_expected.to have_db_column(:description).with_options(null: false) }
    it { is_expected.to have_db_column(:body).with_options(null: false) }
    it { is_expected.to have_db_column(:favorites_count).with_options(default: 0, null: false) }
    it { is_expected.to have_db_column(:author_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:author_id) }
    it { is_expected.to have_db_index(:slug).unique }
  end

  describe '.tagged_with' do
    subject { described_class }

    it { is_expected.to respond_to(:tagged_with).with(1).argument }
  end

  describe '.feed_for' do
    subject { described_class }

    it { is_expected.to respond_to(:feed_for).with(1).argument }
  end
end
