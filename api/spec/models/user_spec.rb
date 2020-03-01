# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { is_expected.to have_one(:profile).autosave(true).dependent(:destroy) }
    it { is_expected.to have_many(:favorites).dependent(:destroy) }
    it { is_expected.to have_many(:favorite_articles).through(:favorites).source(:article) }
    it do
      is_expected.to have_many(:active_relationships).class_name('Relationship')
                                                     .with_foreign_key('follower_id')
                                                     .dependent(:destroy)
    end
    it do
      is_expected.to have_many(:passive_relationships).class_name('Relationship')
                                                      .with_foreign_key('followed_id')
                                                      .dependent(:destroy)
    end
    it { is_expected.to have_many(:following).through(:active_relationships).source(:followed) }
    it { is_expected.to have_many(:followers).through(:passive_relationships).source(:follower) }
    it { is_expected.to have_many(:articles).with_foreign_key('author_id').dependent(:destroy) }
    it { is_expected.to have_many(:comments).with_foreign_key('author_id').dependent(:destroy) }
    it { is_expected.to have_many(:favorites).dependent(:destroy) }
    it { is_expected.to have_many(:favorite_articles).through(:favorites).source(:article) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:password) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:email).with_options(null: false) }
    it { is_expected.to have_db_column(:encrypted_password).with_options(null: false) }
    it { is_expected.to have_db_column(:reset_password_token) }
    it { is_expected.to have_db_column(:reset_password_sent_at) }
    it { is_expected.to have_db_column(:remember_created_at) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_column(:followers_count).with_options(default: 0, null: false) }
    it { is_expected.to have_db_column(:following_count).with_options(default: 0, null: false) }
    it { is_expected.to have_db_index(:email).unique }
    it { is_expected.to have_db_index(:reset_password_token).unique }
  end

  describe 'instance_methods' do
    it { is_expected.to respond_to(:generate_jwt).with(0).arguments }
  end

  describe 'methods' do
    subject { described_class }

    it { is_expected.to respond_to(:from_jwt).with(1).argument }
  end
end
