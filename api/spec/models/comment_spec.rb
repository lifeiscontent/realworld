# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:article).validate }
    it { is_expected.to belong_to(:author).class_name('User').validate }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:body) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:article_id).with_options(null: false) }
    it { is_expected.to have_db_column(:author_id).with_options(null: false) }
    it { is_expected.to have_db_column(:body).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:article_id) }
    it { is_expected.to have_db_index(:author_id) }
  end
end
