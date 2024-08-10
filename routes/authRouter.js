import express from "express";
import {
  register,
  login,
  updateAccount,
  deleteAccount,
  changePassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/", register);
router.get("/", login);
router.patch("/", updateAccount);
router.delete("/", deleteAccount);
router.post("/pass-change", changePassword)
router.patch("/pass-change", resetPassword)

export default router;