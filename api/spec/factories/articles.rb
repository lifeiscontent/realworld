# frozen_string_literal: true

FactoryBot.define do
  factory :article do
    body { 'There are five steps involved.' }
    description { 'There are five steps involved.' }
    sequence(:title) { |n| "Title #{n}" }
  end
end
