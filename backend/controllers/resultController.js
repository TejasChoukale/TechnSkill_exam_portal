import LegacyResult from "../models/LegacyResult.js";

/**
 * Create a new result document in MongoDB.
 */
export async function createResult(req, res) {
  try {
    const {
      studentId,
      studentName,
      examId,
      examTitle,
      score,
      totalMarks,
      percentage,
      passed,
      timeTaken,
      submittedAt,
      answers,
    } = req.body;

    if (!studentId || !studentName || !examId || !examTitle) {
      return res.status(400).json({
        message: "studentId, studentName, examId and examTitle are required.",
      });
    }

    const newResult = await LegacyResult.create({
      studentId: String(studentId),
      studentName,
      examId: String(examId),
      examTitle,
      score: Number(score) || 0,
      totalMarks: Number(totalMarks) || 0,
      percentage: Number(percentage) || 0,
      passed: Boolean(passed),
      timeTaken: Number(timeTaken) || 0,
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
      answers: answers || [],
      breakdown: req.body.breakdown || [],
    });

    return res.status(201).json(newResult);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Unable to save result." });
  }
}

/**
 * Get results, optionally filtered by studentId or examId.
 */
export async function getResults(req, res) {
  try {
    const query = {};

    if (req.query.studentId) {
      query.studentId = String(req.query.studentId);
    }

    if (req.query.examId) {
      query.examId = String(req.query.examId);
    }

    const results = await LegacyResult.find(query).sort({ submittedAt: -1 });
    return res.status(200).json(results);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Unable to fetch results." });
  }
}

/**
 * Get a single result by its MongoDB ID.
 */
export async function getResultById(req, res) {
  try {
    const result = await LegacyResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Result not found." });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Unable to fetch result." });
  }
}
