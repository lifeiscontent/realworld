# realworld

![Web](https://github.com/lifeiscontent/realworld/workflows/Web/badge.svg?branch=master)
![Api](https://github.com/lifeiscontent/realworld/workflows/Api/badge.svg?branch=master)


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
yarn
yarn dev
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
yarn test
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
yarn storybook
```
