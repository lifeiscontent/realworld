### Read Article Query (resolver)

First, we need to set up our GraphQL Type.

[app/graphql/types/article_type.rb][api/app/graphql/types/article_type.rb]

```rb
# frozen_string_literal: true

module Types
  class ArticleType < Types::BaseObject
    field :author, UserType, null: false
    field :body, String, null: false
    field :comments, [CommentType], null: false

    def comments
      object.comments.order(created_at: :desc)
    end

    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :description, String, null: true
    field :favorites_count, Int, null: false
    field :slug, ID, null: false
    field :tags, [TagType], null: false
    field :title, String, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :viewer_did_favorite, Boolean, null: false

    def viewer_did_favorite
      return false if context[:current_user].nil?

      context[:current_user].favorite_articles.include?(object)
    end

    expose_authorization_rules :favorite?, :unfavorite?, :create?, :update?, :delete?
    expose_authorization_rules :create?, with: CommentPolicy,
                                         field_name: 'can_create_comment'
  end
end
```

the following changes will be added to the [GraphQL Schema][api/schema.graphql].

```graphql
type Article {
  author: User!
  body: String!
  canCreate: AuthorizationResult!
  canCreateComment: AuthorizationResult!
  canDelete: AuthorizationResult!
  canFavorite: AuthorizationResult!
  canUnfavorite: AuthorizationResult!
  canUpdate: AuthorizationResult!
  comments: [Comment!]!
  createdAt: ISO8601DateTime!
  description: String
  favoritesCount: Int!
  slug: ID!
  tags: [Tag!]!
  title: String!
  updatedAt: ISO8601DateTime!
  viewerDidFavorite: Boolean!
}
```

Now that we've created the [ArticleType][api/app/graphql/types/article_type.rb], we need to expose it to the [QueryType][api/app/graphql/types/query_type.rb]. Query is the root type which all queries initially come from.

[app/graphql/types/query_type.rb][api/app/graphql/types/query_type.rb]

```rb
# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # ...
    field :article_by_slug, ArticleType, null: false do
      argument :slug, ID, required: true
    end

    def article_by_slug(slug:)
      Article.find_by(slug: slug)
    end
  end
end
```

the following changes will be added to the [GraphQL Schema][api/schema.graphql].

```graphql
type Query {
  articleBySlug(slug: ID!): Article!
}
```

So here, we're exposing a field on the [QueryType][api/app/graphql/types/query_type.rb] called `article_by_slug` which takes 1 required argument `slug`. We then define a method to specify how that data will be resolved.

Let's go ahead and write our tests now.

[spec/graphql/article_by_slug_spec.rb][api/spec/graphql/article_by_slug_spec.rb]

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articleBySlug', type: :graphql do
  before(:each) do
    travel_to Time.zone.local(1994)
  end
  after(:each) do
    travel_back
  end
  let(:query) do
    <<-GRAPHQL
    query ArticleBySlugQuery($slug: ID!) {
      articleBySlug(slug: $slug) {
        author {
          username
        }
        body
        canCreate {
          value
        }
        canCreateComment {
          value
        }
        canDelete {
          value
        }
        canFavorite {
          value
        }
        canUnfavorite {
          value
        }
        canUpdate {
          value
        }
        comments {
          id
        }
        createdAt
        description
        slug
        tags {
          id
          name
        }
        title
        updatedAt
        viewerDidFavorite
      }
    }
    GRAPHQL
  end
end
```

we've set up our query, but a few other things are happing here.

1. In order to maintain deterministic results, we freeze time using [ActiveSupport::TimeHelpers][activesupport::timehelpers].
2. We're querying (almost) every value of an [article][api/app/graphql/types/article_type.rb] (besides data from the associated models). We've chosen to make sure the associations exist by querying for the key of the associations and making sure they respond with the correct values.

Next, let's set up our results.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articleBySlug', type: :graphql do
  let(:author) { create(:author) }
  let(:article) { create(:article, author: author) }
  let(:variables) do
    {
      slug: article.slug
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          articleBySlug: {
            author: {
              username: article.author.username
            },
            body: article.body,
            canCreate: { value: false },
            canCreateComment: { value: false },
            canDelete: { value: false },
            canFavorite: { value: false },
            canUnfavorite: { value: false },
            canUpdate: { value: false },
            comments: [],
            createdAt: article.created_at.iso8601.to_s,
            description: article.description,
            slug: article.slug,
            tags: [],
            title: article.title,
            updatedAt: article.updated_at.iso8601.to_s,
            viewerDidFavorite: false
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
```

> Notes:
>
> Since we've frozen time, and have deterministic results from the factories of FactoryBot we now have a passing test, (this setup might be a bit different from your environment in which case you can pass the data from the created model as part of the result).

Next, let's test some edge cases. We have a few different perspectives on how a user might be looking at this data.

1. The Author of the article might be viewing the data.
2. A User of the website might be viewing the data.
3. A Guest might be viewing the data.

Each of these viewers has different permissions, so let's make sure our tests cover those ideas.

We've already defined the test from the perspective of a guest, let's do the user next.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articleBySlug', type: :graphql do
  # ...
  context 'current_user is a user' do
    let(:current_user) { create(:user) }
    let(:result) do
      {
        data: {
          articleBySlug: {
            author: {
              username: article.author.username
            },
            body: article.body,
            canCreate: { value: true },
            canCreateComment: { value: true },
            canDelete: { value: false },
            canFavorite: { value: true },
            canUnfavorite: { value: false },
            canUpdate: { value: false },
            comments: [],
            createdAt: article.created_at.iso8601.to_s,
            description: article.description,
            slug: article.slug,
            tags: [],
            title: article.title,
            updatedAt: article.updated_at.iso8601.to_s,
            viewerDidFavorite: false
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
```

Great, pretty straight forward right?

There's one thing lingering here as a user.

If you notice, our `canUnfavorite` returns `false`, so as a user, it's probably a good idea to test the case where we can `unfavorite` an article. Let's do that next.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articleBySlug', type: :graphql do
  # ...
  context 'current_user is a user who has favorited the article' do
    let(:current_user) { create(:favorite, article: article, user: build(:user)).user }
    let(:result) do
      {
        data: {
          articleBySlug: {
            author: {
              username: article.author.username
            },
            body: article.body,
            canCreate: { value: true },
            canCreateComment: { value: true },
            canDelete: { value: false },
            canFavorite: { value: false },
            canUnfavorite: { value: true },
            canUpdate: { value: false },
            comments: [],
            createdAt: article.created_at.iso8601.to_s,
            description: article.description,
            slug: article.slug,
            tags: [],
            title: article.title,
            updatedAt: article.updated_at.iso8601.to_s,
            viewerDidFavorite: true
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
```

There are 3 things that changed about this result, `canFavorite.value` now returns `false`, `canUnfavorite.value` now returns `true` and `viewerDidFavorite` now returns `true`.

> Notes: It might make sense to leave these as policy tests, but we want to make sure ActionPolicy exposes the rules as our clients would expect, so that's another reason why we might test the edge cases here.

Let's now test the query in the context of the author.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articleBySlug', type: :graphql do
  context 'current_user is the author of the article' do
    let(:current_user) { author }
    let(:result) do
      {
        data: {
          articleBySlug: {
            author: {
              username: article.author.username
            },
            body: article.body,
            canCreate: { value: true },
            canCreateComment: { value: true },
            canDelete: { value: true },
            canFavorite: { value: false },
            canUnfavorite: { value: false },
            canUpdate: { value: true },
            comments: [],
            createdAt: article.created_at.iso8601.to_s,
            description: article.description,
            slug: article.slug,
            tags: [],
            title: article.title,
            updatedAt: article.updated_at.iso8601.to_s,
            viewerDidFavorite: false
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
```

Great! we've tested all the major cases for how someone could potentially view the data.

We could go a few steps further and test things like `comments` or `tags`, but I'll leave that as an exercise up to you.

[activesupport::timehelpers]: https://api.rubyonrails.org/v5.2.4.1/classes/ActiveSupport/Testing/TimeHelpers.html
[api/spec/graphql/article_by_slug_spec.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/spec/graphql/article_by_slug_spec.rb
[api/app/graphql/types/article_type.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/app/graphql/types/article_type.rb
[api/app/graphql/types/query_type.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/app/graphql/types/query_type.rb
[api/schema.graphql]: https://github.com/lifeiscontent/realworld/blob/master/api/schema.graphql
