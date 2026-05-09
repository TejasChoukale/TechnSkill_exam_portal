import mongoose from "mongoose";

const legacyResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    examId: {
      type: String,
      required: [true, "Exam ID is required"],
      trim: true,
    },
    examTitle: {
      type: String,
      required: [true, "Exam title is required"],
      trim: true,
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: [true, "Total marks is required"],
      min: 0,
    },
    percentage: {
      type: Number,
      required: [true, "Percentage is required"],
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: [true, "Pass/fail status is required"],
    },
    timeTaken: {
      type: Number,
      required: [true, "Time taken is required"],
      min: 0,
    },
    submittedAt: {
      type: Date,
      required: [true, "Submitted time is required"],
      default: Date.now,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    breakdown: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

legacyResultSchema.index({ studentId: 1, examId: 1 });
legacyResultSchema.index({ submittedAt: -1 });

const LegacyResult = mongoose.model("LegacyResult", legacyResultSchema);

export default LegacyResult;
