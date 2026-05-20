import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";

import env from "./config/env.js";
import { connectRedis } from "./config/redis.js";
import { configurePassport } from "./config/passport.js";
import satelliteRoutes from "./routes/satelliteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

configurePassport();
await connectRedis();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "orbital-scope-server",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/satellites", satelliteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

app.listen(env.PORT, () => {
  console.log(`Orbital Scope API listening on http://localhost:${env.PORT}`);
});
