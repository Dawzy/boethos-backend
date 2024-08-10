import express from "express";
import {
  getSheets,
  getSheet,
  createSheet,
  updateSheet,
  deleteSheet
} from "../controllers/sheetsController.js";

import entryRouter from "./entryRouter.js";

const router = express.Router();

// Re-route to entries specific routes
router.use("/:sheetId/entries", entryRouter)

// Sheets routes
router.get("/", getSheets);
router.post("/", createSheet);
router.get("/:sheetId", getSheet);
router.patch("/:sheetId", updateSheet);
router.delete("/:sheetId", deleteSheet);

export default router;