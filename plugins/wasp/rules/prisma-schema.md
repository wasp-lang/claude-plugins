---
globs: ["schema.prisma"]
---
# Prisma Schema in Wasp

## Schema Changes

Changes to `schema.prisma` are not applied until `wasp db migrate-dev --name <descriptive-name>` runs. Continue coding freely and tell the user to run migrations when ready to test.

**Track pending migrations:** The dev server warns about this, but users may miss it when the Wasp developmnet servers are running as background tasks. Remind them before testing/viewing the app, and offer to run migrations:
- [ ] stop server
- [ ] migrate
- [ ] restart
