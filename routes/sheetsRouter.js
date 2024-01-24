import express from "express";
import {
  getSheets,
  getSheet,
  createSheet,
  updateSheet,
  deleteSheet
} from "../controllers/sheetsController.js";

const router = express.Router();

// Sheets routers
router.get("/", getSheets);
router.get("/:sheetId", getSheet);
router.post("/", createSheet);
router.patch("/:projectId", updateSheet);
router.delete("/:projectId", deleteSheet);

export default router;