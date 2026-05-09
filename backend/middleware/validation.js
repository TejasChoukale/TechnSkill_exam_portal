import { body, param, query, validationResult } from "express-validator";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(["student", "admin"])
    .withMessage("Role must be either student or admin"),

  body("enrollmentNumber")
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Enrollment number must be between 1 and 20 characters"),

  handleValidationErrors,
];

export const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

export const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("role")
    .optional()
    .isIn(["student", "admin"])
    .withMessage("Role must be either student or admin"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  handleValidationErrors,
];

// Exam validation rules
export const validateExamCreation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title is required and must be less than 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("subject").trim().notEmpty().withMessage("Subject is required"),

  body("duration")
    .isInt({ min: 1, max: 480 })
    .withMessage("Duration must be between 1 and 480 minutes"),

  body("questions")
    .optional()
    .isArray()
    .withMessage("Questions must be an array"),

  body("questions.*.question")
    .trim()
    .notEmpty()
    .withMessage("Question text is required"),

  body("questions.*.type")
    .optional()
    .isIn(["multiple-choice", "true-false", "short-answer", "essay"])
    .withMessage("Invalid question type"),

  body("questions.*.options")
    .optional()
    .isArray()
    .withMessage("Options must be an array"),

  body("questions.*.correctAnswer")
    .exists()
    .withMessage("Correct answer is required"),

  body("questions.*.marks")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Marks must be a positive number"),

  handleValidationErrors,
];

export const validateExamUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be less than 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("subject")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Subject cannot be empty"),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived", "cancelled"])
    .withMessage("Invalid status"),

  body("duration")
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage("Duration must be between 1 and 480 minutes"),

  handleValidationErrors,
];

// Result validation rules
export const validateResultSubmission = [
  body("examId").isMongoId().withMessage("Valid exam ID is required"),

  body("answers").isArray().withMessage("Answers must be an array"),

  body("answers.*.questionId")
    .isMongoId()
    .withMessage("Valid question ID is required"),

  body("answers.*.answer").exists().withMessage("Answer is required"),

  handleValidationErrors,
];

// Parameter validation
export const validateObjectId = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  handleValidationErrors,
];

// Query validation
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
];
