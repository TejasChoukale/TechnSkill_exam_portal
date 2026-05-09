import express from "express";
import {
  createResult,
  getResults,
  getResultById,
} from "../controllers/resultController.js";

const router = express.Router();

// Create a new exam result record
router.post("/", createResult);

// Fetch results optionally filtered by studentId or examId
router.get("/", getResults);

// Fetch a single result by MongoDB document ID
router.get("/:id", getResultById);

export default router;
