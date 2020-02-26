# frozen_string_literal: true

FactoryBot.define do
  factory :user, aliases: %i[author followed follower] do
    email { Faker::Internet.safe_email }
    password { 'password' }
  end
end
