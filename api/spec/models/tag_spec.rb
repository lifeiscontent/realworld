# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:articles).through(:taggings) }
    it { is_expected.to have_many(:taggings).dependent(:destroy) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
  end

  describe 'columns' do
    it { is_expected.to have_db_column(:name).with_options(null: false) }
    it { is_expected.to have_db_column(:taggings_count).with_options(default: 0, null: false) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:name).unique }
  end

  describe 'methods' do
    subject { described_class }

    it 'returns all tags in use, most used first, then by name' do
      article = create(:article, author: create(:author))
      unused = create(:tag, name: 'unused')
      zeta = create(:tag, name: 'zeta')
      alpha = create(:tag, name: 'alpha')
      popular = create(:tag, name: 'popular')
      article.update!(tags: [zeta, alpha, popular])
      create(:article, author: create(:author), tags: [popular])

      expect(subject.most_used).to eq([popular, alpha, zeta])
      expect(subject.most_used).not_to include(unused)
    end

    it 'finds or creates tags by name' do
      existing = create(:tag, name: 'ruby')

      tags = subject.from_names(['ruby', ' rails ', '', 'rails'])

      expect(tags.map(&:name)).to eq(%w[ruby rails])
      expect(tags.first).to eq(existing)
      expect(subject.where(name: 'rails').count).to eq(1)
    end
  end
end
