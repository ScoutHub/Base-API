## Project setup

```bash
$ npm install
```

## Env setup

```
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
DB_HOST=
JWT_SECRET=
JWT_REFRESH_TOKEN=
```

## Compile and run the project locally

### If you want to use the api locally, you need to setup a database like MySQL or MariaDB

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Compile and run the project with docker

```
$ docker-compose -f compose.dev.yml up -d --build
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
