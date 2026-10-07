# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Relationship, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:followed).class_name('User').validate }
    it { is_expected.to belong_to(:follower).class_name('User').validate }
  end

  describe '.create_or_find_by!' do
    let(:followed) { create(:followed) }
    let(:follower) { create(:follower) }

    it 'returns the existing relationship for a second call' do
      first = described_class.create_or_find_by!(followed:, follower:)

      expect(described_class.create_or_find_by!(followed:, follower:)).to eq(first)
    end
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:followed_id).with_options(null: false) }
    it { is_expected.to have_db_column(:follower_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(%i[followed_id follower_id]).unique }
    it { is_expected.to have_db_index(:follower_id) }
  end
end
