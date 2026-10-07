# realworld

![Web](https://github.com/lifeiscontent/realworld/actions/workflows/web.yml/badge.svg?branch=main)
![Api](https://github.com/lifeiscontent/realworld/actions/workflows/api.yml/badge.svg?branch=main)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://main--5fcdd27b2771900021fc381e.chromatic.com)

A [RealWorld](https://docs.realworld.show) app with a GraphQL API. The
GraphQL schema maps one to one to the RealWorld REST API.

| Project | Stack |
| --- | --- |
| [`api`](api) | Ruby 4, Rails 8.1, graphql-ruby, action_policy, Postgres 18 |
| [`web`](web) | TypeScript, Vite, React 19, React Router 8, Apollo Client 4, Storybook 10 |

The two projects deploy independently. Each project has its own
`mise.toml`, so [mise](https://mise.jdx.dev) installs the correct tool
versions in each folder.

## Setup

### Api

The API needs Postgres. Set `DATABASE_URL` if Postgres is not on
`localhost:5432`.

```sh
cd api
mise install
bin/setup
```

`bin/setup` installs the gems, prepares the database, and starts the API on
port 4000.

### Web

```sh
cd web
mise install
pnpm install
pnpm dev
```

The app opens on <http://localhost:5173> and uses the API on port 4000.

## Tests

### Api

```sh
cd api
bundle exec rspec
```

### Web

```sh
cd web
pnpm test
```

`pnpm test` runs the Storybook stories as browser tests. To run the
RealWorld e2e suite, start the API, then run:

```sh
cd web
TEST_MODE=fullstack pnpm exec playwright test
```

See [web/docs/feature-development.md](web/docs/feature-development.md) for
the structure of the web app.
