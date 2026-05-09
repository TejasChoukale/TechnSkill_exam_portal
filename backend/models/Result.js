import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  answer: mongoose.Schema.Types.Mixed, // Can be string, array, or number
  isCorrect: {
    type: Boolean,
    default: false,
  },
  marksObtained: {
    type: Number,
    default: 0,
  },
  timeSpent: Number, // in seconds
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Student is required"],
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: [true, "Exam is required"],
  },

  // Attempt information
  attemptNumber: {
    type: Number,
    default: 1,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  submittedAt: Date,
  timeSpent: Number, // in seconds

  // Answers and scoring
  answers: [answerSchema],
  totalQuestions: {
    type: Number,
    default: 0,
  },
  attemptedQuestions: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  wrongAnswers: {
    type: Number,
    default: 0,
  },
  skippedQuestions: {
    type: Number,
    default: 0,
  },

  // Marks
  totalMarks: {
    type: Number,
    default: 0,
  },
  marksObtained: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  // Result status
  status: {
    type: String,
    enum: ["in-progress", "completed", "timeout", "cancelled"],
    default: "in-progress",
  },
  isPassed: {
    type: Boolean,
    default: false,
  },
  grade: String,

  // Additional info
  ipAddress: String,
  userAgent: String,
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
  },

  // Review and feedback
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewedAt: Date,
  feedback: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
resultSchema.pre("save", async function () {
  this.updatedAt = Date.now();

  // Calculate statistics
  if (this.answers && this.answers.length > 0) {
    this.attemptedQuestions = this.answers.length;
    this.correctAnswers = this.answers.filter((a) => a.isCorrect).length;
    this.wrongAnswers = this.answers.filter((a) => !a.isCorrect).length;

    // Calculate marks obtained
    this.marksObtained = this.answers.reduce(
      (total, a) => total + (a.marksObtained || 0),
      0,
    );

    // Calculate percentage
    if (this.totalMarks > 0) {
      this.percentage =
        Math.round((this.marksObtained / this.totalMarks) * 100 * 100) / 100;
    }
  }
});

// Compound indexes for better query performance
resultSchema.index({ student: 1, exam: 1 });
resultSchema.index({ exam: 1, status: 1 });
resultSchema.index({ student: 1, status: 1 });
resultSchema.index({ createdAt: -1 });

// Ensure unique attempt per student per exam
resultSchema.index({ student: 1, exam: 1, attemptNumber: 1 }, { unique: true });

const Result = mongoose.model("Result", resultSchema);

export default Result;
