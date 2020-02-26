# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Registration, type: :model do
  context 'when valid?' do
    subject { Registration.new(email: 'test@test.com', password: 'password', username: 'tester') }

    it 'should be valid' do
      expect(subject).to be_valid
    end

    it 'should be able to save' do
      expect(subject.save).to be true
    end
  end

  context 'when invalid?' do
    it 'should be invalid' do
      expect(subject).to be_invalid
    end

    it 'should not ba able to save' do
      expect(subject.save).to be false
      expect(subject.errors.size).to be > 0
    end
  end

  describe '#valid?' do
    it { is_expected.to respond_to(:valid?) }
  end

  describe '#user' do
    it { is_expected.to respond_to(:user) }
  end

  describe '#profile' do
    it { is_expected.to respond_to(:profile) }
  end

  describe '#save' do
    it { is_expected.to respond_to(:save) }
  end

  describe '#email' do
    it { is_expected.to delegate_method(:email).to(:user) }
  end

  describe '#email=' do
    it { is_expected.to delegate_method(:email=).to(:user).with_arguments('test@example.com') }
  end

  describe '#username' do
    it { is_expected.to delegate_method(:username).to(:profile) }
  end

  describe '#username=' do
    it { is_expected.to delegate_method(:username=).to(:profile).with_arguments('tester') }
  end

  describe '#password' do
    it { is_expected.to delegate_method(:password).to(:user) }
  end

  describe '#password=' do
    it { is_expected.to delegate_method(:password=).to(:user).with_arguments('tester') }
  end
end
