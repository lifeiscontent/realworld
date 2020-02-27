# frozen_string_literal: true

FactoryBot.define do
  factory :user, aliases: %i[author followed follower] do
    sequence(:email) { |n| "person#{n}@example.com" }
    password { 'password' }
  end
end
