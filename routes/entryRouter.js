import express from "express";
import {
  newEntry,
  getEntry,
  updateEntry,
  deleteEntry
} from "../controllers/entryController.js";

const router = express.Router();

// Auth specific routes
router.get("/", getEntry);
router.post("/", newEntry);
router.patch("/:entryId", updateEntry);
router.delete("/:entryId", deleteEntry);

export default router;