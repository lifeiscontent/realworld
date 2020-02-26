# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Favorite, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:article).counter_cache }
    it { is_expected.to belong_to(:user).validate }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:article) }
    it { is_expected.to validate_presence_of(:user) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:article_id).with_options(null: false) }
    it { is_expected.to have_db_column(:user_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:article_id) }
    it { is_expected.to have_db_index(:user_id) }
    it { is_expected.to have_db_index(%i[article_id user_id]) }
  end
end
