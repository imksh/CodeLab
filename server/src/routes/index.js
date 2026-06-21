import express from "express";
import authRoutes from "./auth.route.js";
import problemRoutes from "./problem.route.js";
import userRoutes from "./user.route.js";
import submissionRoutes from "./submission.route.js";

const router = express.Router();

// Health check
router.get("/", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/problems", problemRoutes);
router.use("/users", userRoutes);
router.use("/submissions", submissionRoutes);

export default router;
