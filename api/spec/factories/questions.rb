# frozen_string_literal: true

FactoryBot.define do
  factory :question do
    sequence(:body) { |n| "Body #{n}" }
  end
end