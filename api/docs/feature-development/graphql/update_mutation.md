### Update Article Mutation (resolver)

First, let's setup the mutation.

**app/graphql/mutations/update_article.rb**

```rb
# frozen_string_literal: true

module Mutations
  class UpdateArticle < Mutations::BaseMutation
    class UpdateArticleInput < Types::BaseInputObject
      argument :title, String, required: true
      argument :description, String, required: true
      argument :body, String, required: true
      argument :tag_ids, [ID], required: true

      def prepare
        to_h
      end
    end

    argument :slug, ID, required: true
    argument :input, UpdateArticleInput, required: true

    field :article, Types::ArticleType, null: false

    def resolve(slug:, input:)
      article = Article.find_by(slug: slug)

      authorize! article, to: :update?

      article.update!(input)

      { article: article }
    end
  end
end
```

There's a few things happening here, so lets break them down.

1. We create the Input class in GraphQL
   - We make the input easier to deal with in the resolver by transforming the input to a hash with the `prepare` method (this is a hook within GraphQL Ruby for Inputs).
2. We specify our `slug` argument as an `ID` and mark it required.
3. We specify our `input` argument as the `UpdateArticleInput` we created and mark it as required.
4. We specify the return `field` as `article` and say it won't be null. (more on this soon).
5. We specify our `resolve` method and expose our `slug` and `input` parameter as a keyword argument.
6. We use our ActionPolicy to make sure we're authorized to `update` an Article.
7. Once we know we're authorized, we update the article on behalf of the authorized user.
8. We return the updated `article` as the response.

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
    field :update_article, mutation: Mutations::UpdateArticle
  end
end

```

Next, let's create our first test.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'updateArticle', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    mutation UpdateArticleMutation($slug: ID!, $input: UpdateArticleInput!) {
      updateArticle(slug: $slug, input: $input) {
        article {
          title
          description
          body
          tags {
            id
            name
          }
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
      slug: article.slug,
      input: {
        title: article.title,
        description: article.description,
        body: article.body,
        tagIds: tags.map(&:id)
      }
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'updateArticle' => nil
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
            'path' => ['updateArticle']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end
end
```

First, we want to make sure our policies are working, and test that a guest cannot update an article.

Next, let's test that a random user cannot update an article.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'updateArticle', type: :graphql do
  # ...
  context 'current_user is a user' do
    let(:current_user) { create(:user) }

    let(:result) do
      {
        'data' => {
          'updateArticle' => nil
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
            'path' => ['updateArticle']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end
end
```

And finally, let's test that an author can update their article.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'updateArticle', type: :graphql do
  # ...
  context 'current_user is author' do
    let(:current_user) { author }
    let(:result) do
      {
        'data' => {
          'updateArticle' => {
            'article' => {
              'body' => 'There are five steps involved.',
              'description' => 'There are five steps involved.',
              'tags' => [
                { 'id' => '1', 'name' => 'tag1' },
                { 'id' => '2', 'name' => 'tag2' },
                { 'id' => '3', 'name' => 'tag3' }
              ],
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
