//dot env
import "./src/config/dotenv.js"
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173","https://codelab-imksh.netlify.app", "https://codelab.imksh.online",process.env.CLIENT_URL],
    credentials: true,
  }),
);

// API Routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  const { message, status } = err;
  console.error("Unhandled error:", err);
  res
    .status(status || 500)
    .json({ message: message || "Internal server error." });
});

// Start server

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
