import express from "express";
import {
  register,
  login,
  updateAccount,
  deleteAccount
} from "../controllers/authController.js";

const router = express.Router();

// Auth specific routes
router.post("/register", register);
router.post("/login", login);
router.patch("/:accountId", updateAccount);
router.delete("/:accountId", deleteAccount);

export default router;