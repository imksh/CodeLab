import express from "express";
import {
  createSubmission,
  runCode,
  getUserSubmissions,
  getProblemSubmissions,
} from "../controllers/submission.controller.js";
import protectedRoutes from "../middlewares/auth.middleware.js";

const router = express.Router();

// All submission routes require authentication
router.use(protectedRoutes);

router.post("/", createSubmission);
router.post("/run", runCode);
router.get("/me", getUserSubmissions);
router.get("/problem/:problemId", getProblemSubmissions);

export default router;
