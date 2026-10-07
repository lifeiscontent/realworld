# RealWorld API

This is the Rails API of the RealWorld app. It has one GraphQL endpoint:
`POST /graphql`. Each query and mutation matches one endpoint of the
[RealWorld REST API](https://docs.realworld.show).

## Tools

mise installs Ruby and PostgreSQL. The versions are in `mise.toml`.

```sh
mise install
```

## Database

The API uses PostgreSQL. By default, it connects to the local server with the
databases `realworld_development` and `realworld_test`.

To use a different server, set `DATABASE_URL`. Rails merges it into the
settings of the current environment.

```sh
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/realworld_development
```

## Setup

Run `bin/setup`. It installs the gems, prepares the database, and starts the
server.

```sh
mise exec -- bin/setup
```

To prepare the database without the server, use `--skip-server`. To start the
server again, use `bin/dev`. The server listens on port 4000. Set `PORT` to
use a different port.

The health check is at `GET /up`.

## Specs

The specs use the test database. If you set `DATABASE_URL`, set it to the
test database before you run the specs. If you do not, the specs use the
development database.

```sh
mise exec -- bundle exec rspec
mise exec -- bin/rubocop
```

`bin/ci` does the setup, RuboCop, and RSpec in sequence. The GitHub workflow
runs `bin/ci`.

## GraphQL schema

The web client reads the schema from `schema.graphql`. When you change a type,
a field, or an argument, dump the schema again and commit the file:

```sh
mise exec -- bin/rails graphql:schema:idl
```

The GitHub workflow fails when `schema.graphql` is not current.

## Authentication

The `login` and `register` mutations return a JWT in `token`. Send it in the
`Authorization` header. The API accepts the `Token` and `Bearer` schemes:

```
Authorization: Token <jwt>
```

A token is valid for 24 hours. The API treats a request with a missing,
expired, or incorrect token as a guest request.

## Errors

A query returns null when the record does not exist. A mutation returns an
error. The error has a code in `extensions.code`. Each code matches an HTTP
status of the REST API:

| Code                   | HTTP status | Cause                                       |
| ---------------------- | ----------- | ------------------------------------------- |
| `UNAUTHENTICATED`      | 401         | The mutation needs a user and has no token. |
| `FORBIDDEN`            | 403         | The user cannot change the record.          |
| `NOT_FOUND`            | 404         | The record does not exist.                  |
| `UNPROCESSABLE_ENTITY` | 422         | The record is not valid.                    |

For `UNPROCESSABLE_ENTITY`, `extensions.errors` contains the messages for each
field, as in the REST API:

```json
{ "email": ["has already been taken"], "password": ["is too short (minimum is 6 characters)"] }
```

A failed login gives `{ "base": ["email or password is invalid"] }`. It does
not show if the email exists.

A request with variables that are not a JSON object gets HTTP status 400.
