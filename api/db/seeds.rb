# frozen_string_literal: true

# Creates example tags, users, articles, and comments for development.
# Run it with bin/rails db:seed.

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
  user = User.create!(
    email: Faker::Internet.email,
    password: 'password',
    username: Faker::Internet.unique.username(separators: [])
  )
  20.times do
    article = user.articles.create!(
      body: Faker::Lorem.paragraph(sentence_count: 10),
      description: Faker::Lorem.sentence,
      title: Faker::Lorem.sentence
    )
    article.tags << Tag.offset(rand(Tag.count)).first
    5.times do
      User.offset(rand(User.count)).first.comments.create(article:, body: Faker::Lorem.sentence)
    end
  end
end
