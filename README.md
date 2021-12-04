# realworld

![Web](https://github.com/lifeiscontent/realworld/workflows/Web/badge.svg?branch=master)
![Api](https://github.com/lifeiscontent/realworld/workflows/Api/badge.svg?branch=master)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://master--5fcdd27b2771900021fc381e.chromatic.com)

This repo implements opinionated best practices for Apollo Client, React, Next.js and Storybook.

1 caveat is it does not try to implement a best practice on UI Components as the styles are reused from the [realworld.io](https://github.com/gothinkster/realworld) project.

## Setup

### Api

```sh
cd api
bundle
bin/rails db:migrate
bin/rails db:seed
bin/rails s
```

### Web

```sh
cd web
npm install
npm run dev
```

## Testing

### Api

```sh
cd api
bin/rails spec
```

### Web

```sh
cd web
npm test
```

## Tooling

### Api

#### Generate ERD

```sh
bin/rails erd
```

### Web

#### Storybook

```sh
npm run storybook
```
