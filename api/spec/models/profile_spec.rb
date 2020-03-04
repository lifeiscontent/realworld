# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Profile, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user).validate }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:user) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:bio).with_options(default: '', null: false) }
    it { is_expected.to have_db_column(:image_url) }
    it { is_expected.to have_db_column(:user_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:user_id).unique }
  end
end
