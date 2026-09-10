import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import fs from "fs";
import path from "path";
import job from "./lib/cron.js";
import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const publicDir = path.join(process.cwd(), "public");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(clerkMiddleware());

app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook,
);

// Normal API/body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

app.use("/api/auth", authRouter);

// Serve Vite frontend in production
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.listen(PORT, () => {
  connectDB();

  console.log(`Server is running on port ${PORT}`);

  if (process.env.NODE_ENV === "production") {
    job.start();
  }
});
