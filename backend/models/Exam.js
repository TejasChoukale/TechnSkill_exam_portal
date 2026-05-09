import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "short-answer", "essay"],
    default: "multiple-choice",
  },
  options: [
    {
      type: String,
      trim: true,
    },
  ],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, array, or number
    required: [true, "Correct answer is required"],
  },
  marks: {
    type: Number,
    default: 1,
    min: [0, "Marks cannot be negative"],
  },
  explanation: String,
  timeLimit: Number, // in seconds
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Exam title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
  },
  course: String,
  semester: Number,
  department: String,

  // Exam settings
  totalMarks: {
    type: Number,
    default: 0,
  },
  passingMarks: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number, // in minutes
    required: [true, "Duration is required"],
    min: [1, "Duration must be at least 1 minute"],
  },
  totalQuestions: {
    type: Number,
    default: 0,
  },

  // Questions
  questions: [questionSchema],

  // Status and scheduling
  status: {
    type: String,
    enum: ["draft", "published", "archived", "cancelled"],
    default: "draft",
  },
  scheduledDate: Date,
  startTime: Date,
  endTime: Date,

  // Instructions
  instructions: {
    type: String,
    trim: true,
  },

  // Settings
  settings: {
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    shuffleOptions: {
      type: Boolean,
      default: false,
    },
    showResults: {
      type: Boolean,
      default: true,
    },
    allowReview: {
      type: Boolean,
      default: true,
    },
    maxAttempts: {
      type: Number,
      default: 1,
      min: [1, "Max attempts must be at least 1"],
    },
    timeLimitPerQuestion: Number, // in seconds
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    negativeMarkingValue: {
      type: Number,
      default: 0,
    },
  },

  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Created by is required"],
  },
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
examSchema.pre("save", async function () {
  this.updatedAt = Date.now();

  // Calculate total marks and questions if not set
  if (this.questions && this.questions.length > 0) {
    this.totalQuestions = this.questions.length;
    this.totalMarks = this.questions.reduce(
      (total, q) => total + (q.marks || 1),
      0,
    );
  }
});

// Index for better query performance
examSchema.index({ status: 1, scheduledDate: 1 });
examSchema.index({ createdBy: 1 });
examSchema.index({ subject: 1, department: 1 });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
