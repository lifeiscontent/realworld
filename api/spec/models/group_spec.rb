# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Group, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:users).through(:memberships) }
    it { is_expected.to have_many(:memberships).dependent(:destroy).validate }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:name).with_options(null: false) }
    it { is_expected.to have_db_column(:memberships_count).with_options(default: 0, null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:name).unique }
  end

  describe 'counter_cache' do
    subject { create(:group) }

    it { expect(subject.memberships_count).to eq(0) }

    context 'when group has members' do
      let(:user) { create(:user) }

      before do
        subject.users << user
      end

      it { expect(subject.memberships_count).to eq(1) }

      context 'when members have left the group' do
        before do
          subject.users = []
        end

        it { expect(subject.memberships_count).to eq(0) }
      end
    end
  end
end
