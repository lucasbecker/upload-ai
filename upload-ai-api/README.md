# upload.ai api

## Getting started

Clone and install dependencies:

```shell
  git clone https://github.com/lucasbecker/upload-ai.git
  cd upload-ai/upload-ai-api
  npm install
```

Run the following command to create your SQLite database file. This also creates the `Video` and `Prompt` tables that are defined in `prisma/schema.prisma``:

```shell
  npx run prisma migrate dev
```

Start the REST API server:

```shell
 npm run dev
```
