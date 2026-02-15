import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Security headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// Trust proxy — required for express-rate-limit to work correctly behind
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting on auth routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Job Tracker API is running" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/applications", applicationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
