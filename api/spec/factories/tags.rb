# frozen_string_literal: true

FactoryBot.define do
  factory :tag do
    name { Faker::Lorem.unique.word }
  end
end
