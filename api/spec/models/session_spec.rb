# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Session, type: :model do
  context 'when valid' do
    let(:user) { create(:user, profile: build(:profile)) }

    subject { described_class.new(email: user.email, password: 'password') }

    it 'is valid' do
      expect(subject).to be_valid
    end

    it 'does not have a token' do
      expect(subject.token).to be_nil
    end
  end

  context 'when persisted' do
    let(:user) { create(:user, profile: build(:profile)) }

    subject { described_class.new(email: user.email, password: 'password').tap(&:save) }

    it 'is valid' do
      expect(subject).to be_valid
    end

    it 'has a token' do
      expect(subject.token).to be_a(String)
    end
  end

  context 'when invalid' do
    it 'is invalid' do
      expect(subject).to be_invalid
    end

    it 'is not persistable' do
      expect(subject.save).to be false
      expect(subject.errors.size).to be_positive
    end
  end

  describe 'instance_methods' do
    it { is_expected.to respond_to(:email).with(0).arguments }
    it { is_expected.to respond_to(:email=).with(1).argument }
    it { is_expected.to respond_to(:invalid?).with(0).arguments }
    it { is_expected.to respond_to(:password=).with(1).argument }
    it { is_expected.to respond_to(:save).with(0).arguments }
    it { is_expected.to respond_to(:token).with(0).arguments }
    it { is_expected.to respond_to(:user).with(0).arguments }
    it { is_expected.to respond_to(:valid?).with(0).arguments }
    it { is_expected.to_not respond_to(:password).with(0).arguments }
  end
end
