import Exam from "../models/Exam.js";

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({}).populate("createdBy", "name email");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (exam) {
      res.json(exam);
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      duration,
      totalMarks,
      passingMarks,
      instructions,
      questions,
      status,
    } = req.body;

    const exam = new Exam({
      title,
      description,
      subject,
      duration,
      totalMarks,
      passingMarks,
      instructions,
      questions,
      status: status || "draft",
      createdBy: req.user._id,
    });

    const createdExam = await exam.save();
    res.status(201).json(createdExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (exam) {
      exam.title = req.body.title || exam.title;
      exam.description = req.body.description || exam.description;
      exam.subject = req.body.subject || exam.subject;
      exam.duration = req.body.duration || exam.duration;
      exam.totalMarks = req.body.totalMarks || exam.totalMarks;
      exam.passingMarks = req.body.passingMarks || exam.passingMarks;
      exam.instructions = req.body.instructions || exam.instructions;
      exam.questions = req.body.questions || exam.questions;
      exam.status = req.body.status || exam.status;

      const updatedExam = await exam.save();
      res.json(updatedExam);
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (exam) {
      await Exam.findByIdAndDelete(req.params.id);
      res.json({ message: "Exam removed" });
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
