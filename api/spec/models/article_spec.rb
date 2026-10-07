# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article, type: :model do
  describe 'columns' do
    it { is_expected.to have_db_column(:slug).with_options(null: false) }
    it { is_expected.to have_db_column(:title).with_options(null: false) }
    it { is_expected.to have_db_column(:description).with_options(null: false) }
    it { is_expected.to have_db_column(:body).with_options(null: false) }
    it { is_expected.to have_db_column(:favorites_count).with_options(default: 0, null: false) }
    it { is_expected.to have_db_column(:author_id).with_options(null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:author_id) }
    it { is_expected.to have_db_index(:slug).unique }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:body) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:slug) }
    it { is_expected.to validate_presence_of(:title) }
  end

  describe 'uniqueness' do
    subject { create(:article, author: build(:author)) }

    it { is_expected.to validate_uniqueness_of(:slug) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:author).class_name('User').validate }
    it { is_expected.to have_many(:comments).dependent(:destroy) }
    it { is_expected.to have_many(:favorites).dependent(:destroy) }
    it { is_expected.to have_many(:taggings).dependent(:destroy) }
    it { is_expected.to have_many(:tags).through(:taggings) }
  end

  describe '.tagged_with' do
    subject(:tagged) { described_class.tagged_with(Tag.all) }

    before do
      create_list(:tag, 3)
      create_list(:article, 3, author: build(:author), tags: [])
      create_list(:article, 3, author: build(:author), tags: Tag.all)
    end

    it 'returns each article with a tag one time' do
      expect(tagged.length).to be 3
    end
  end

  describe '#slug' do
    it 'comes from the title' do
      expect(create(:article, author: create(:author), title: 'How to train').slug).to eq('how-to-train')
    end
  end

  describe '#favorites_count' do
    let(:user) { create(:user) }
    let(:article) { create(:article, author: build(:author)) }
    let(:favorite) { build(:favorite, user:, article:) }

    it 'increments favorites_count by 1 when user favorites an article' do
      expect do
        favorite.save!
      end.to change(article, :favorites_count).by(1)
    end

    it 'decrements favorites_count by 1 when user unfavorites an article' do
      favorite.save!

      expect do
        favorite.destroy!
      end.to change(article, :favorites_count).by(-1)
    end
  end
end
