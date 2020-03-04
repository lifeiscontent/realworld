# frozen_string_literal: true

FactoryBot.define do
  factory :user, aliases: %i[author followed follower] do
    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:username) { |n| "user#{n}" }
    password { 'password' }
  end
end
