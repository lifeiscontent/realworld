# Feature Development in Rails

## Creating a Model

1.  Take a look at the erd first by running `rails erd`.
2.  Once you think about the data model you need to create, make a test in `/specs/models`.

```rb
# frozen_string_literal: true

 require 'rails_helper'

 RSpec.describe NewModel, type: :model do
 end

```

then, run `rails spec` and see it fail, you only should ever write just enough code to make your expectation of what should happen pass.

We can go and create the model now, because our intent is to have the model exist.

Only add columns for the model **after** you've added a test for the column/association.

## Creating a resolver in GraphQL

In GraphQL a resolver can be one of 2 types, a `query`, or a `mutation`.
There are a few oddities around GraphQL in Ruby, but for the most part things will translate 1 to 1 in terms of how GraphQL works in other platforms.

### Creating a Resolver

When you're creating a resolver there are a few things you should consider before creating one. **CRUD** (Create, Read, Update, Delete)

#### Create Mutation (resolver)

a create mutation should always follow this signature:

```graphql
type ModelName {
  id: ID!
  modelNameField: String!
}

input CreateModelNameInput {
  modelNameField: String!
}

type CreateModelNamePayload {
  modelName: ModelName!
}

type Mutation {
  createModelName(input: CreateModelNameInput!): CreateModelNamePayload!
}
```

this rougly translates to the following in ruby:

```ruby
# frozen_string_literal: true

module Mutations
  class CreateModelName < Mutations::BaseMutation
    class CreateModelNameInput < Types::BaseInputObject
      argument :model_name_field, String, required: true

      def prepare
        to_h
      end
    end

    argument :input, CreateModelNameInput, required: true
    field :model_name, Types::ModelNameType, null: false

    def resolve(input:)
      authorize! ModelName, to: :create?

      model_name = ModelName.create!(input)

      { model_name: model_name }
    end
  end
end
```

#### Read Query (resolver)

a read query should always follow this signature:

```graphql
type ModelName {
  id: ID!
  modelNameField: String!
}

type Query {
  modelNames: [ModelName]!
  modelName(id: ID!): ModelName!
  modelNameByModelNameField(modelNameField: String!): ModelName!
}
```

this rougly translates to the following in ruby:

```ruby
module Types
  class QueryType < Types::BaseObject
    field :model_names, [ModelNameType], null: false

    def model_names
      ModelName.all
    end

    field :model_name, ModelNameType, null: false do
      argument :id, ID, required: true
    end

    def model_name(id:)
      ModelName.find(id)
    end

    field :model_name_by_model_name_field, ModelNameType, null: false do
      argument :model_name_field, String, required: true
    end

    def model_name_by_model_name_field(model_name_field:)
      ModelName.find_by(model_name_field: model_name_field)
    end
  end
end
```

#### Update Mutation (resolver)

a update mutation should always follow this signature:

```graphql
type ModelName {
  id: ID!
  modelNameField: String!
}

input UpdateModelNameInput {
  modelNameField: String
}

type UpdateModelNamePaylaod {
  modelName: ModelName!
}

type Mutation {
  updateModelName(
    id: ID!
    input: UpdateModelNameInput!
  ): UpdateModelNamePayload!
}
```

this rougly translates to the following in ruby:

```ruby
# frozen_string_literal: true

module Mutations
  class UpdateModelName < Mutations::BaseMutation
    class UpdateModelNameInput < Types::BaseInputObject
      argument :model_name_field, String, required: true

      def prepare
        to_h
      end
    end

    argument :id, ID, required: true
    argument :input, UpdateModelNameInput, required: true

    field :model_name, Types::ModelNameType, null: false

    def resolve(id:, input:)
      model_name = ModelName.find(id)

      authorize! model_name, to: :update?

      model_name.update!(input)

      { model_name: model_name }
    end
  end
end

```

#### Delete Mutation (resolver)

a delete mutation should always follow this signature:

```graphql
type ModelName {
  id: ID!
  modelNameField: String!
}

type DeleteModelNamePaylaod {
  modelName: ModelName!
}

type Mutation {
  deleteModelName(id: ID!): DeleteModelNamePayload!
}
```

this rougly translates to the following in ruby:

```ruby
# frozen_string_literal: true

module Mutations
  class DeleteModelName < Mutations::BaseMutation
    argument :id, ID, required: true

    field :model_name, Types::ModelNameType, null: true

    def resolve(id:)
      model_name = ModelName.find(id)

      authorize! model_name, to: :delete?
      model_name.destroy!

      { model_name: model_name }
    end
  end
end
```

> After reading through the **CRUD** actions, you might be thinking this feels a lot like a rails controller, and you're not wrong, that's exactly how resolvers should be thought about. the thing GraphQL aims to solve is rather than having 20+ requests for each record in a complex application, you aggragate all of your data requirements in a single request via a GraphQL Query.

### Testing GraphQL Endpoints

There's still not a best practice around this, but in this repo, you'll see each query that is depended on in the web application is tested, so when you need a new query in the web app, just add a test in the backend with that query to make sure the backend can guarantee it still works across each CI run.
