import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(scriptDir, "..");
const envPath = path.join(serverDir, ".env");
const prismaCliPath = path.join(
  serverDir,
  "node_modules",
  "prisma",
  "build",
  "index.js"
);

dotenv.config({
  path: envPath,
  override: false,
});

const child = spawn(process.execPath, [prismaCliPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
