import express from "express";
import {
  getEntries,
  getEntry,
  newEntry,
  updateEntry,
  deleteEntry
} from "../controllers/entryController.js";

const router = express.Router();

// Entries routes
router.get("/", getEntries);
router.post("/", newEntry);
router.get("/:entryId", getEntry);
router.patch("/:entryId", updateEntry);
router.delete("/:entryId", deleteEntry);

export default router;