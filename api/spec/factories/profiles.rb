# frozen_string_literal: true

FactoryBot.define do
  factory :profile do
    sequence(:username) { |n| "user#{n}" }
  end
end
