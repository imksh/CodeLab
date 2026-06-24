import express from "express";
import protectedRoutes, { isAdmin } from "../middlewares/auth.middleware.js";
import { uploadAttachment } from "../middlewares/upload.middleware.js";
import {
  createProblem,
  updateProblem,
  deleteProblem,
  getAnalytics
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protectedRoutes, isAdmin);

router.post("/problems", uploadAttachment.single("attachment"), createProblem);
router.put("/problems/:id", uploadAttachment.single("attachment"), updateProblem);
router.delete("/problems/:id", deleteProblem);
router.get("/analytics", getAnalytics);

export default router;