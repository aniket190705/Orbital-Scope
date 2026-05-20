#!/bin/sh
set -e

node ./scripts/wait-for-port.mjs db 5432 60
node ./scripts/run-prisma.mjs migrate deploy --schema ../prisma/schema.prisma
exec node index.js
