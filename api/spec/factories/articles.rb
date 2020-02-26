# frozen_string_literal: true

FactoryBot.define do
  factory :article do
    body { Faker::Lorem.paragraph(sentence_count: 10) }
    description { Faker::Lorem.sentence }
    title { Faker::Lorem.sentence }
  end
end
