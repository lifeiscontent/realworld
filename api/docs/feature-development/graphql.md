## Creating Resolvers in GraphQL

We'll be creating the **CRUD** actions for the Article model.

### Setup

For a better testing in RSpec, We've created a simple DSL You can do this by taking a look at [spec/support/graphql.rb](../../spec/support/graphql.rb) it is autoloaded via [/spec/rails_helper.rb](../../spec/rails_helper.rb).

### General terms

#### Query

the `Query` is the root type which all data in GraphQL is resolved.

You can think of this as the facility to make `GET` requests in a `REST` paradigm.

#### Mutation

the `Mutation` is the root type which all data is manipulated in GraphQL.

You can think of this as the facility to make `POST`, `PUT`, `DELETE` and `PATCH` requests in a `REST` paradigm.

#### Resolver

A resolver is the base idea which both a `Mutation` and a `Query` do. They ultimately **fetch** data. It is up to you to tell the Types how that is done, although in GraphQL Ruby, that mostly comes from ActiveRecord models, but could come from things like ElasticSearch, HTTP, RPC, etc.

- [How to make a Create Mutation](./graphql/create_mutation.md)
- [How to make a Delete Mutation](./graphql/delete_mutation.md)
- [How to make a Read Query](./graphql/read_query.md)
- [How to make a Update Mutation](./graphql/update_mutation.md)
- [What is a Viewer in GraphQL](./graphql/viewer.md)
