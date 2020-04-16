[![CircleCI](https://circleci.com/gh/withoutlogin/checkout-api.svg?style=shield)](https://circleci.com/gh/withoutlogin/checkout-api)

# Cart API

This app was built on the NestJS framework and provides REST API for e-commerce cart functionality.

## Architecture

This app consists of four main modules:

- `CartDomainModule` which covers the logic for cart mutations,
- `CartWriteModule` which is a persistence layer for the Domain,
- `CartReadModule` that stores and serves current Cart state based on in-memory materialized views,
- `PricingModule` which provides product-related data like prices and descriptions for other modules.

Project incorporates Command-Query Responsibility Segregation (CQRS) and Event Sourcing patterns.

## Docs

When the application is running, go to `http://localhost:3000/` to load Swagger UI, which shows all of the REST endpoints and allows to run queries from the browser. Most of endpoints are configured with sample parameter values that are valid with automatically loaded sample data.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn build
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
