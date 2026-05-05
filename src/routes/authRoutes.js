import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").get(registerUser).post(registerUser);
router.route("/login").get(loginUser).post(loginUser);
router.get("/profile", protect, getProfile);
router.post("/logout", logoutUser);

export default router;
