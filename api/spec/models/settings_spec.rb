# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Settings, type: :model do
  context 'when valid' do
    let(:user) { create(:user, profile: build(:profile)) }

    subject { described_class.new(user: user, email: user.email, password: 'password', bio: 'hello world, I am here') }

    it 'is valid' do
      expect(subject).to be_valid
    end
  end

  context 'when persisted' do
    let(:user) { create(:user, profile: build(:profile)) }

    subject do
      described_class.new(
        user: user,
        email: user.email,
        password: 'password',
        bio: 'this is my bio',
        image_url: '//placehold.it/400x400'
      ).tap(&:save)
    end

    it 'is valid' do
      expect(subject).to be_valid
    end

    it 'has a bio' do
      expect(subject.user.profile.bio).to eq 'this is my bio'
    end

    it 'has a image_url' do
      expect(subject.user.profile.image_url).to eq '//placehold.it/400x400'
    end

    it 'has a email' do
      expect(subject.user.email).to eq user.email
    end

    it 'has a username' do
      expect(subject.user.profile.username).to eq user.profile.username
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
    it { is_expected.to respond_to(:bio).with(0).arguments }
    it { is_expected.to respond_to(:bio=).with(1).argument }
    it { is_expected.to respond_to(:email).with(0).arguments }
    it { is_expected.to respond_to(:email=).with(1).argument }
    it { is_expected.to respond_to(:image_url).with(0).arguments }
    it { is_expected.to respond_to(:image_url=).with(1).argument }
    it { is_expected.to respond_to(:invalid?).with(0).arguments }
    it { is_expected.to respond_to(:password=).with(1).argument }
    it { is_expected.to respond_to(:save).with(0).arguments }
    it { is_expected.to respond_to(:user_id).with(0).arguments }
    it { is_expected.to respond_to(:user).with(0).arguments }
    it { is_expected.to respond_to(:username).with(0).arguments }
    it { is_expected.to respond_to(:username=).with(1).argument }
    it { is_expected.to respond_to(:valid?).with(0).arguments }
    it { is_expected.to_not respond_to(:password).with(0).arguments }
  end
end
