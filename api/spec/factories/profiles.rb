# frozen_string_literal: true

FactoryBot.define do
  factory :profile do
    username { Faker::Internet.username }
  end
end
