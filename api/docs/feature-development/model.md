## Creating a Model in Rails

We'll be creating the first Model in this App: an Article.

### Table schema

At a high level, these are the features we want to support:

1. We want users to navigate to articles by a unique `slug`.
   1. This is a required feature, so it can't be `null`.
2. An `article` must have a `title`.
   1. This is a required feature, so it can't be `null`.
3. As a preview of the article, we want to have a `description` for our articles.
   1. This is a required feature, so it can't be `null`.
4. We need a `body` so the user can read the article.
   1. This is a required feature, so it can't be `null`.
5. We want the user to be able to favorite the article, and show the article favorites as a `favorites_count`.
   1. This is a required feature, so it can't be `null`.
   2. When you create the article it always starts with `0` favorites.
6. An article is always created by someone, so we need an `author` as well.

   1. This is a required feature, so it can't be `null`.
   2. we use `author` here, but we're mapping to the `users` table, so our foreign key points back to the reference table.

7. We'll want timestamps to know when the article was updated or created.

### Model tests

First, let's start by writing a set of tests so we can guarantee the contract we've set up with the database.

```rb
RSpec.describe Article, type: :model do
  describe 'columns' do
    it { is_expected.to have_db_column(:slug).with_options(null: false) }
    it { is_expected.to have_db_column(:title).with_options(null: false) }
    it { is_expected.to have_db_column(:description).with_options(null: false) }
    it { is_expected.to have_db_column(:body).with_options(null: false) }
    it { is_expected.to have_db_column(:favorites_count).with_options(default: 0, null: false) }
    it { is_expected.to have_db_column(:author_id).with_options(null: false, foreign_key: { to_table: :users }) }
    it { is_expected.to have_db_column(:created_at).with_options(null: false) }
    it { is_expected.to have_db_column(:updated_at).with_options(null: false) }
    it { is_expected.to have_db_index(:author_id) }
    it { is_expected.to have_db_index(:slug).unique }
  end
end
```

This might not make a ton of sense right now, but as the app changes, these tests will protect you and coworkers from changes that happen to the database, whenever you add/remove functionality to the table, this section of tests should be updated as well so you can continue to guarantee those expectations.

### Table Schema

Let's take a look at the columns we'll need to support our Article.

```rb
# frozen_string_literal: true

class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.string :slug, null: false, index: { unique: true }
      t.string :title, null: false
      t.string :description, null: false
      t.text :body, null: false
      t.integer :favorites_count, null: false, default: 0
      t.belongs_to :author, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
```

#### Validation tests

In our database, we set up contracts about which columns are required, but to take advantage of what Rails have to offer, we should set up validation logic to give us a nice abstraction when handling errors.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article, type: :model do
  # ...
  describe 'validations' do
    it { is_expected.to validate_presence_of(:body) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:slug) }
    it { is_expected.to validate_presence_of(:title) }
  end
end
```

these are all the fields we expect to be present, so now let's add the respective code to make these tests pass.

```rb
# frozen_string_literal: true

class Article < ApplicationRecord
  validates :body, presence: true
  validates :description, presence: true
  validates :slug, presence: true
  validates :title, presence: true
end
```

Great, we're done with presence validations.

There's one thing left though, on our table schema we said slugs were unique, and as you can imagine, there are validations for that.

So let's set up the test for that.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article, type: :model do
  # ...
  describe 'uniqueness' do
    subject { create(:article, author: build(:author)) }
    it { is_expected.to validate_uniqueness_of(:slug) }
  end
end
```

> **Note:** I've chosen to create factory_bot factories without their respective associations here, this is a personal preference, but it's recommended that you only create things you need, and by doing so, I'm opting into what I need vs potentially creating extra data in my tests unknowingly (which can be very slow).

we need to test a `valid` article, so here I've switched my subject to one.

Once we do that, we can test the uniqueness constraint.

Let's add the validation to the model:

```rb
# frozen_string_literal: true

class Article < ApplicationRecord
  # ...
  validates :slug, presence: true, uniqueness: true
end
```

And now our tests pass!

#### Association tests

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article, type: :model do
  # ...
  describe 'associations' do
    it { is_expected.to belong_to(:author).class_name('User').validate }
    it { is_expected.to have_many(:comments).dependent(:destroy) }
    it { is_expected.to have_many(:favorites).dependent(:destroy) }
    it { is_expected.to have_many(:taggings).dependent(:destroy) }
    it { is_expected.to have_many(:tags).through(:taggings) }
  end
end
```

let's break this down.

1. We need to tell rails that an `author` maps to a `User` model and for good measure, we want to make sure the `User` exists because you can't have an article without the person who created it!

2. We want to allow `users` to be able to leave `comments` on an `article`, so we know the article will `have_many` `comments`.
   1. When the `author` `destroys` the `article` then the `comments` should be `destroyed` as well.
3. We want to allow `users` to be able to `favorite` an `article`, so we know the `article` will `have_many` `favorites`.
   1. When the `author` deletes the `article` then the `favorites` should be `destroyed` as well.
4. As an `author`, we want to be able to add multiple `tags` to an `article` and we can do that `through` `taggings`.
   1. When the `author` `destroys` the `article` then the `taggings` should be `destroyed` as well.
5. We already talked about this in 4.

Phew! that was a lot, let's go ahead and update the article to have the correct associations.

```rb
# frozen_string_literal: true

class Article < ApplicationRecord
  # ...
  belongs_to :author, class_name: 'User', validate: true
  has_many :comments, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
end
```

And now our tests pass!

There are a few more features we'd like to add to our Article, let's talk about them.

1. We'd like to get all the articles with specific tags.
2. We'd like to get all the articles of authors a user is following.

#### Tagged with

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article, type: :model do
  describe '.tagged_with' do
    before(:each) do
      create_list(:tag, 3)
      create_list(:article, 3, author: build(:author), tags: [])
      create_list(:article, 3, author: build(:author), tags: Tag.all)
    end

    subject { described_class.tagged_with(Tag.all) }

    it { expect(subject.length).to be 3 }
  end
end

```

So here, we've created 6 articles, 3 of which have tags.

We expect that we should only get the 3 tagged articles back.

Let's make that test pass!

```rb
# frozen_string_literal: true

class Article < ApplicationRecord
  def self.tagged_with(tag)
    return none unless tag.present?

    joins(:taggings).where(taggings: { tag: tag }).distinct
  end
end
```

> You might be wondering why did we return `none` here?
>
> let's talk about that. its quite often you fight `nil` in ruby, in this case, if we were to get `nil` back it would just be messy conditional logic where ever we used this method. So rather than dealing with `nil`, we return an empty active record collection to circumvent it. This is a pretty good pattern to follow especially when creating custom class methods in models because it allows you to chain methods together in the class.
>
> Next, we hook into our join table we mentioned earlier `taggings` and where we have `taggings` that have the tags we passed in, we return the articles, but again, only the `distinct` articles, if we didn't do that, we'd have a total of `9` coming back.
>
> Not bad right? :)

#### Feed for

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article, type: :model do
  # ...
  describe '.feed_for' do
    let(:user) { create(:user, profile: build(:profile)) }
    let(:author) { create(:author, profile: build(:profile)) }
    let(:relationship) { create(:relationship, follower: user, followed: author) }

    before(:each) do
      create_list(:article, 3, author: build(:author))
      create_list(:article, 3, author: author)
    end

    subject { described_class.feed_for(relationship.follower) }

    it { expect(subject.length).to be 3 }
  end
end
```

Here, we've created a `user`, `author`, `relationship` and 6 `articles`.

We expect that we should only see the 3 `articles`, for the `author` that we followed.

> You might be wondering why we are using the user from the relationship, it's just so we don't need to call `user.reload` after we've created the `relationship`.

Let's make that test pass!

```rb
# frozen_string_literal: true

class Article < ApplicationRecord
  # ...
  def self.feed_for(user)
    return none unless user.present?

    where(author: user.following)
  end
end
```

Nice and clean, just a simple where clause `author` is a `user` that is being `followed`.

### Favorites count

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article, type: :model do
  # ...
  describe '#favorites_count' do
    let(:user) { create(:user) }
    let(:article) { create(:article, author: build(:author)) }
    let(:favorite) { build(:favorite, user: user, article: article) }

    it 'will increment favorites_count by 1 when user favorites an article' do
      expect do
        favorite.save!
      end .to change { article.favorites_count }.by(1)
    end

    it 'will decrement favorites_count by 1 when user unfavorites an article' do
      favorite.save!

      expect do
        favorite.destroy!
      end .to change { article.favorites_count }.by(-1)
    end
  end
end
```

we added a `favorites_count` field to our table, let's test the expectation of what should happen to it:

1. When a user favorites an article
   1. `favorites_count` should be incremented.
2. When a user unfavorites an article
   1. `favorites_count` should be decremented.

Let's make the test pass!

```rb
# frozen_string_literal: true

class Favorite < ApplicationRecord
  belongs_to :article, counter_cache: true
end
```

Rails provide built-in support for incrementing/decrementing counts, so this is all we need to do!

> You might be wondering, why did we test what rails provide us?
>
> Great question! The reason we wrote tests is that its a part of our business logic, these are expectations of what **should** happen. Even though the functionality is something that Rails gives us, the tests help us preserve and communicate the business logic expectations.
