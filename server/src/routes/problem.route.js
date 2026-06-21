import express from "express";
import protectedRoutes from "../middlewares/auth.middleware.js";
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  likeProblem,
  dislikeProblem,
  getRandomProblem,
  getProblemByNumber,
} from "../controllers/problem.controller.js";

const router = express.Router();

router.get("/", protectedRoutes, getProblems);
router.get("/random", protectedRoutes, getRandomProblem);
router.get("/:id", protectedRoutes, getProblemById);
router.get("/n/:number", protectedRoutes, getProblemByNumber);
router.post("/:id/like", protectedRoutes, likeProblem);
router.post("/:id/dislike", protectedRoutes, dislikeProblem);

// Admin / protected routes
router.post("/", protectedRoutes, createProblem);
router.put("/:id", protectedRoutes, updateProblem);
router.delete("/:id", protectedRoutes, deleteProblem);

export default router;
