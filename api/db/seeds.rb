# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'faker'

%w[
  programming
  javascript
  emberjs
  angularjs
  react
  mean
  node
  rails
].each do |tag|
  Tag.create(name: tag)
end

10.times do
  User.new(
    email: Faker::Internet.email,
    password: 'password'
  ) do |user|
    user.save!
    user.create_profile(username: Faker::Internet.username(separators: []))
    20.times do
      user.articles.build(
        body: Faker::Lorem.paragraph(sentence_count: 10),
        description: Faker::Lorem.sentence,
        title: Faker::Lorem.sentence
      ) do |article|
        article.save!
        article.tags << Tag.order('random()').first
        5.times do
          User.order('random()').first.comments.create(
            article: article,
            body: Faker::Lorem.sentence
          )
        end
      end
    end
  end
end
