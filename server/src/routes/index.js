import express from "express";
import authRoutes from "./auth.route.js";
import problemRoutes from "./problem.route.js";
import userRoutes from "./user.route.js";
import submissionRoutes from "./submission.route.js";
import adminRoutes from "./admin.route.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({message:"Hello Developers"});
});

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Codelab server is running",  timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/problems", problemRoutes);
router.use("/users", userRoutes);
router.use("/submissions", submissionRoutes);
router.use("/admin", adminRoutes);

export default router;
