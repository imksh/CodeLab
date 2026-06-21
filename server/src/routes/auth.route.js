import express from "express";
import protectedRoutes from "../middlewares/auth.middleware.js";
import resetPasswordMiddleware from "../middlewares/resetPassword.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import {
  signup,
  login,
  logout,
  genOtp,
  verifyOtp,
  resetPassword,
  checkAuth,
  updateProfile,
  getUserStats,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", protectedRoutes, logout);
router.post("/gen-otp", genOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPasswordMiddleware, resetPassword);
router.get("/check", protectedRoutes, checkAuth);
router.get("/stats", protectedRoutes, getUserStats);
router.put("/profile", protectedRoutes, upload.single("avatar"), updateProfile);

export default router;
