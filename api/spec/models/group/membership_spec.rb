require 'rails_helper'

RSpec.describe Group::Membership, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:group).validate.counter_cache }
    it { is_expected.to belong_to(:user).validate }
  end

  describe 'validations' do
    let(:group) { create(:group) }
    let(:user) { create(:user) }

    subject { create(:group_membership, group: group, user: user) }

    it { is_expected.to validate_uniqueness_of(:user_id).scoped_to(:group_id) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:group_id).with_options(null: false) }
    it { is_expected.to have_db_column(:user_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(%i[group_id user_id]).unique }
  end
end
