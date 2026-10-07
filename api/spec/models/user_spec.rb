# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
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
  end

  describe 'validations' do
    subject { build(:user) }

    it { is_expected.to validate_presence_of(:username) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:username) }
    it { is_expected.to validate_uniqueness_of(:email).ignoring_case_sensitivity }
    it { is_expected.to have_secure_password }
    it { is_expected.to validate_length_of(:password).is_at_least(6) }
    it { is_expected.to allow_values('jake@example.com').for(:email) }
    it { is_expected.not_to allow_values('jake', 'jake@', 'ja ke@example.com').for(:email) }
    it { is_expected.to allow_values(nil, '', 'https://example.com/jake.jpg', 'http://example.com').for(:image) }
    it { is_expected.not_to allow_values('jake.jpg', 'javascript:alert(1)', 'ftp://example.com/jake.jpg').for(:image) }
  end

  describe 'normalizations' do
    it { is_expected.to normalize(:email).from(' Jake@Example.COM ').to('jake@example.com') }
    it { is_expected.to normalize(:username).from(' jake ').to('jake') }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:email).with_options(null: false) }
    it { is_expected.to have_db_column(:password_digest).with_options(null: false) }
    it { is_expected.to have_db_column(:bio).of_type(:text) }
    it { is_expected.to have_db_column(:image).of_type(:string) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_column(:username).with_options(null: false) }
    it { is_expected.to have_db_index(:email).unique }
    it { is_expected.to have_db_index(:username).unique }
  end

  describe '.authenticate_by' do
    let!(:user) { create(:user, email: 'jake@example.com', password: 'jakejake') }

    it 'finds the user by the email in any case' do
      expect(described_class.authenticate_by(email: 'JAKE@example.com', password: 'jakejake')).to eq(user)
    end

    it 'returns nil for a wrong password' do
      expect(described_class.authenticate_by(email: 'jake@example.com', password: 'wrong')).to be_nil
    end

    it 'accepts a bcrypt hash that Devise made' do
      digest = BCrypt::Password.create('devisepassword', cost: BCrypt::Engine::MIN_COST)
      described_class.where(id: user.id).update_all(password_digest: digest) # rubocop:disable Rails/SkipsModelValidations

      expect(described_class.authenticate_by(email: 'jake@example.com', password: 'devisepassword')).to eq(user)
    end
  end

  describe '.from_jwt' do
    let(:user) { create(:user) }

    it 'returns the user of a token' do
      expect(described_class.from_jwt(user.generate_jwt)).to eq(user)
    end

    it 'returns nil for an expired token' do
      token = user.generate_jwt

      travel(User::JWT_LIFETIME + 1.minute) { expect(described_class.from_jwt(token)).to be_nil }
    end

    it 'returns nil for a token signed with another key' do
      token = JWT.encode({ id: user.id, exp: 1.hour.from_now.to_i }, Rails.application.secret_key_base, 'HS256')

      expect(described_class.from_jwt(token)).to be_nil
    end

    it 'returns nil for an unsigned token' do
      token = JWT.encode({ id: user.id, exp: 1.hour.from_now.to_i }, nil, 'none')

      expect(described_class.from_jwt(token)).to be_nil
    end

    it 'returns nil for a deleted user' do
      token = user.generate_jwt
      user.destroy!

      expect(described_class.from_jwt(token)).to be_nil
    end

    it 'returns nil for text that is not a token' do
      expect(described_class.from_jwt('not a token')).to be_nil
    end
  end
end
