### Update Article Mutation (resolver)

First, let's setup the mutation.

**app/graphql/mutations/delete_article.rb**

```rb
# frozen_string_literal: true

module Mutations
  class DeleteArticle < Mutations::BaseMutation
    argument :slug, ID, required: true

    field :article, Types::ArticleType, null: false

    def resolve(slug:)
      article = Article.find_by(slug: slug)

      authorize! article, to: :delete?
      article.destroy!

      { article: article }
    end
  end
end
```

the following changes will be added to the GraphQL Schema

```graphql
type DeleteArticlePayload {
  article: Article!
}
```

There's a few things happening here, so lets break them down.

1. We specify our `slug` argument as an `ID` and mark it required.
2. We specify the return `field` as `article` and say it won't be null. (more on this soon).
3. We specify our `resolve` method and expose our `slug` parameter as a keyword argument.
4. We use our ActionPolicy to make sure we're authorized to `delete` an Article.
5. Once we know we're authorized, we delete the article on behalf of the authorized user.
6. We return the deleted `article` as the response.

> Notes:
>
> One thing that is happening implicitly is our error handling. Let's demistify how that's working.
>
> 1. the article is being updated with the `update!` method so if the validation fails, it will throw an error. In which case we have a rescue block catching those errors in the `api_schema.rb` that look like this:
>
> ```rb
>  rescue_from ActiveRecord::RecordInvalid do |error|
>    raise GraphQL::ExecutionError.new(
>      error.message,
>      extensions: {
>        code: 'GRAPHQL_VALIDATION_FAILED',
>        errors: error.record.errors.full_messages
>      }
>    )
>  end
>
>  rescue_from ActiveModel::ValidationError do |error|
>    raise GraphQL::ExecutionError.new(
>      error.message,
>      extensions: {
>        code: 'GRAPHQL_VALIDATION_FAILED',
>        errors: error.model.errors.full_messages
>      }
>    )
>  end
> ```

Next, let's expose it to the `MutationType` which is the root type that mutations resolve through.

```rb
# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :delete_article, mutation: Mutations::DeleteArticle
  end
end
```

The following changes will be added to the GraphQL Schema

```graphql
type Mutation {
  deleteArticle(slug: ID!): DeleteArticlePayload
}
```

Next, let's create our first test.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'deleteArticle', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    mutation DeleteArticleMutation($slug: ID!) {
      deleteArticle(slug: $slug) {
        article {
          title
          description
          body
        }
      }
    }
    GRAPHQL
  end
  let(:author) { create(:author) }
  let(:tags) { create_list(:tag, 3) }
  let(:article) { create(:article, author: author) }
  let(:variables) do
    {
      slug: article.slug
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'deleteArticle' => nil
        },
        'errors' => [
          {
            'extensions' => {
              'code' => 'UNAUTHORIZED',
              'details' => {},
              'fullMessages' => []
            },
            'locations' => [
              { 'column' => 7, 'line' => 2 }
            ],
            'message' => 'You are not authorized to perform this action',
            'path' => ['deleteArticle']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end
end
```

First, we want to make sure our policies are working, and test that a guest cannot delete an article.

Next, let's test that a random user cannot delete an article.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'deleteArticle', type: :graphql do
  # ...
  context 'current_user is a user' do
    let(:current_user) { create(:user) }

    let(:result) do
      {
        'data' => {
          'deleteArticle' => nil
        },
        'errors' => [
          {
            'extensions' => {
              'code' => 'UNAUTHORIZED',
              'details' => {},
              'fullMessages' => []
            },
            'locations' => [
              { 'column' => 7, 'line' => 2 }
            ],
            'message' => 'You are not authorized to perform this action',
            'path' => ['deleteArticle']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end
end
```

And finally, let's test that an author can delete their article.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'deleteArticle', type: :graphql do
  # ...

  context 'current_user is author' do
    let(:current_user) { author }
    let(:result) do
      {
        'data' => {
          'deleteArticle' => {
            'article' => {
              'body' => 'There are five steps involved.',
              'description' => 'There are five steps involved.',
              'title' => 'Title 1'
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
```
