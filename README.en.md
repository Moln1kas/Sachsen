<div align="center">
  <img src="https://molnikas.su/img/logo.svg" width="128" alt="Sachsen Logo" />
  <h3>Sachsen Monorepo</h3>
  <p><a href="README.md">Русский</a> | <a href="README.en.md">English</a></p>
  <p>
    <a href="https://t.me/sachsen_launcher">
      <img src="https://img.shields.io/badge/Telegram-Subscribe-blue?logo=telegram" alt="Telegram" />
    </a>
  </p>
</div>

## Table of Contents

- [Overview](#overview)
- [Development](#development)
- [License](#license)

## Overview

The main idea of this project is to provide the player with a program capable of automatically configuring and launching a modified Minecraft client (Fabric).

In addition to the launcher functionality, I have also implemented several other components that together form a complete architecture — if you can call it that.

It’s important to mention that this is my first project of this scale. The code may contain bugs and is not intended for production environments. The project is developed for educational purposes.

The project is local, meaning it is primarily developed for me and my friends. However, this does not mean that others are excluded. To participate, you need to register and fill out a short questionnaire. After your application is approved by a moderator, you will be able to join the server.  
**AT THE MOMENT, THE PROJECT IS IN THE EARLY STAGES OF DEVELOPMENT, SO THIS SECTION IS NOT YET RELEVANT.**

## Development

To get started, you’ll need **yarn** and **docker-compose**.  
For Tauri support, follow the official [setup guide](https://v2.tauri.app/start/prerequisites/).

### Installing dependencies

Install all packages using:

```sh
yarn install
```

### Setting up .env files

In the packages inside the `apps/` directory that contain a `.env.example` file, create `.env` files following the provided template.

### Running containers

In the `docker-compose.yml` file you can change database names and passwords — just make sure to also update your Prisma configuration accordingly.
Then start the Postgres and Redis containers:

```sh
docker-compose up
```

### Setting up Prisma

In the `apps/api` package, configure Prisma.
Verify that the `DATABASE_URL` in your `.env` file is correct, then generate the client:

```sh
yarn workspace @repo/api prisma generate
```

and apply migrations:

```sh
yarn workspace @repo/api prisma migrate dev
```

### Running packages

`@repo/api` (backend):

```sh
yarn dev:api
```

`@repo/app` (launcher app):

```sh
yarn dev:app
# or
cd apps/app && yarn dev
```

## License

Each package in this repository has its own license.
See the corresponding `LICENSE.txt` file inside each package for more details.
