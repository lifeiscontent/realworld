### Create Article Mutation (resolver)

[api/spec/graphql/create_article_spec.rb][api/spec/graphql/create_article_spec.rb]

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'createArticle', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    mutation CreateArticleMutation($input: CreateArticleInput!) {
      createArticle(input: $input) {
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
end
```

There are a few conventions you can follow here in GraphQL.

1. the name of the mutation is [createArticle][api/app/graphql/mutations/create_article.rb], because its a **Create** Action followed by the name of the resource [Article][api/app/models/article.rb].
2. you should only need a single `input` variable<sup>1</sup> this can be thought of as the `params` object in Rails controllers.
3. The payload you return should always be a key to the type of resource you're modifying. E.g. [article][api/app/graphql/types/article_type.rb] in this case.

> Notes:
>
> 1. If you're creating a nested model, such as a `comment` in our app, you might need to specify the parent key, in the case of a `comment` that would be the `articleSlug` since we don't need the `id` in GraphQL.

Next, we need to specify the input parameters of the mutation.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'createArticle', type: :graphql do
  # ...
  let(:tags) { create_list(3, :tags) }
  let(:article_attributes) { attributes_for(:article) }
  let(:variables) do
    {
      input: {
        title: article_attributes[:title],
        description: article_attributes[:description],
        body: article_attributes[:body],
        tagIds: tags.map(&:id)
      }
    }
  end
end
```

Now let's write the mutation.

```rb
# frozen_string_literal: true

module Mutations
  class CreateArticle < Mutations::BaseMutation
    class CreateArticleInput < Types::BaseInputObject
      argument :title, String, required: true
      argument :description, String, required: true
      argument :body, String, required: true
      argument :tag_ids, [ID], required: true

      def prepare
        to_h
      end
    end

    argument :input, CreateArticleInput, required: true
    field :article, Types::ArticleType, null: false

    def resolve(input:)
      authorize! Article, to: :create?

      article = context[:current_user].articles.create!(input)

      { article: article }
    end
  end
end
```

the following changes will be added to the [GraphQL Schema][api/schema.graphql].

```graphql
input CreateArticleInput {
  title: String!
  description: String!
  body: String!
  tagIds: [ID!]!
}

type CreateArticlePayload {
  article: Article!
}
```

A few things are happening here, so let's break them down.

1. We create the Input class in GraphQL
   - We make the input easier to deal with in the resolver by transforming the input to a hash with the `prepare` method (this is a hook within GraphQL Ruby for Inputs).
2. We specify our `input` argument as the `CreateArticleInput` we created and mark it as required.
3. We specify the return `field` as [article][api/app/graphql/types/article_type.rb] and say it won't be `null`. (more on this soon).
4. We specify our `resolve` method and expose our `input` parameter as a keyword argument.
5. We use our [ActionPolicy][api/app/policies/article_policy.rb] to make sure we're authorized to `create` an [Article][api/app/models/article.rb].
6. Once we know we're authorized, we create the article on behalf of the authorized user.
7. We return the created [article][api/app/graphql/types/article_type.rb] as the response.

> Notes:
>
> One thing that is happening implicitly is our error handling. Let's demistify how that's working.
>
> 1. the article is being created with the `create!` method so if the validation fails, it will throw an error. In which case we have a rescue block catching those errors in the [api_schema.rb][api/app/graphql/api_schema.rb] that look like this:
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

Next, let's expose it to the [MutationType][api/app/graphql/types/mutation_type.rb] which is the root type that mutations resolve through.

```rb
# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_article, mutation: Mutations::CreateArticle
  end
end
```

the following changes will be added to the [GraphQL Schema][api/schema.graphql].

```graphql
type Mutation {
  createArticle(input: CreateArticleInput!): CreateArticlePayload
}
```

Next, let's create our [first test][api/spec/graphql/create_article_spec.rb].

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'createArticle', type: :graphql do
  # ...
  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          createArticle: nil
        },
        errors: [
          {
            extensions: { code: 'UNAUTHORIZED', details: {}, fullMessages: [] },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action', path: ['createArticle']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end
end
```

In this test, we make sure we're not letting anyone create articles they must be logged in.

Next, let's test the logged in case.

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'createArticle', type: :graphql do
  # ...
  context 'current_user is defined' do
    let(:current_user) { create(:user) }

    let(:result) do
      {
        data: {
          createArticle: {
            article: {
              body: article_attributes[:body],
              description: article_attributes[:description],
              tags: tags.map { |tag| { id: tag.id.to_s, name: tag.name } },
              title: article_attributes[:title]
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
```

Great, now we've tested our happy path and the expectations of how our authorizations work.

> Notes:
>
> There's a caveat here, We're relying on the fact that our factories will always return the same data for our tests (this might not be the case for your codebase) ideally, you want your fixture data/factories to return sequenced data so your tests are reliable.

[activesupport::timehelpers]: https://api.rubyonrails.org/v5.2.4.1/classes/ActiveSupport/Testing/TimeHelpers.html
[api/app/graphql/api_schema.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/app/graphql/api_schema.rb
[api/app/policies/article_policy.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/app/policies/article_policy.rb
[api/app/graphql/types/article_type.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/app/graphql/types/article_type.rb
[api/app/models/article.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/app/models/article.rb
[api/spec/graphql/create_article_spec.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/spec/graphql/create_article_spec.rb
[api/app/graphql/mutations/create_article.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/app/graphql/mutations/create_article.rb
[api/app/graphql/types/mutation_type.rb]: https://github.com/lifeiscontent/realworld/blob/master/api/app/graphql/types/mutation_type.rb
[api/schema.graphql]: https://github.com/lifeiscontent/realworld/blob/master/api/schema.graphql
