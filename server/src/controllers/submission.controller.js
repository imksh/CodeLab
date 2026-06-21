import { Submission } from "../models/submission.model.js";
import { Problem } from "../models/problem.model.js";
import { runTestCases } from "../utils/codeExecutor.js";

// Create a new submission and execute code
export const createSubmission = async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;
    const user = req.user;

    // Fetch the problem to get test cases and constraints
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    // Run the code against test cases
    const executionResult = await runTestCases(
      language,
      code,
      problem.driverCode?.[language] || "",
      problem.testCases,
      problem.timeLimit || 2,
      problem.memoryLimit || 256,
    );

    // Save submission to DB
    const submission = await Submission.create({
      user: user._id,
      problem: problemId,
      language,
      code,
      status: executionResult.status,
      executionTime: executionResult.executionTime,
      memory: null, // Memory parsing requires more complex docker stats parsing, skipping for MVP
    });

    res.status(201).json({
      success: true,
      data: submission,
      executionDetails: executionResult,
    });
  } catch (error) {
    next(error);
  }
};

// Run code without saving submission
export const runCode = async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    const executionResult = await runTestCases(
      language,
      code,
      problem.driverCode?.[language] || "",
      problem.testCases.filter((tc) => !tc.isHidden),
      problem.timeLimit || 2,
      problem.memoryLimit || 256,
    );

    res.status(200).json({
      success: true,
      executionDetails: executionResult,
    });
  } catch (error) {
    next(error);
  }
};

// Get all submissions for the logged-in user
export const getUserSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate("problem", "title difficulty")
      .sort("-createdAt");

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

// Get submissions for a specific problem for the logged-in user
export const getProblemSubmissions = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const submissions = await Submission.find({
      user: req.user._id,
      problem: problemId,
    }).sort("-createdAt");

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};
