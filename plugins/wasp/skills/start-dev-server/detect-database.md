# Database Detection

Detect which database the Wasp app is configured to use.

## Detection Methods

### Method 1: Check schema.prisma (Recommended)

Read the `schema.prisma` file in the project root and look for the `datasource` block:

```prisma
datasource db {
  provider = "postgresql"  // or "sqlite"
  // ...
}
```

### Method 2: Check for .env files (fallback)

Look for `DATABASE_URL` in `.env` or `.env.server`:
- SQLite URLs typically look like: `file:./dev.db` or `file:./data/app.db`
- PostgreSQL URLs look like: `postgresql://user:pass@host:5432/dbname`

## Docker Database Container

Docker needs to be installed and running for the managed Postgres database container (`wasp start db`) to work.
