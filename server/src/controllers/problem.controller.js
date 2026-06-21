import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";

export const getProblems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const problems = await Problem.find()
      .sort({ number: 1 })
      .select("-testCases") // Hide test cases for list
      .skip(skip)
      .limit(limit);

    const total = await Problem.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const submissions = await Submission.find({
      user: req.user._id,
    });

    const problemStatusMap = new Map();

    for (const submission of submissions) {
      const problemId = submission.problem.toString();

      const currentStatus = problemStatusMap.get(problemId);

      if (submission.status === "Accepted") {
        problemStatusMap.set(problemId, "Accepted");
      } else if (!currentStatus) {
        problemStatusMap.set(problemId, "Attempted");
      }
    }

    const problemsWithStatus = problems.map((problem) => ({
      ...problem.toObject(),
      solveStatus:
        problemStatusMap.get(problem._id.toString()) || "Unattempted",
    }));

    res.status(200).json({
      success: true,
      data: problemsWithStatus,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const likeProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    problem.likes += 1;
    await problem.save();

    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

export const dislikeProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    problem.dislikes += 1;
    await problem.save();

    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id).lean();
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    const submissions = await Submission.find({
      user: req.user._id,
      problem: req.params.id,
    }).lean();

    const totalSubmissions = await Submission.countDocuments({
      user: req.user._id,
      problem: req.params.id,
    }).lean();

    // In a real application, you might filter out hidden test cases here
    // based on user role or submission status.

    const isSolved = submissions?.some(
      (submission) => submission.status === "Accepted",
    );

    const solveStatus =
      submissions.length > 0
        ? isSolved
          ? "Accepted"
          : "Attempted"
        : "Unattempted";

    const updatedProblem = {
      ...problem,
      totalSubmissions,
      userSubmissions: submissions,
      solveStatus,
    };

    res.status(200).json({
      success: true,
      data: updatedProblem,
    });
  } catch (error) {
    next(error);
  }
};

export const getRandomProblem = async (req, res, next) => {
  try {
    const problems = await Problem.aggregate([
      {
        $sample: { size: 1 },
      },
    ]);
    const problem = problems[0];
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    const submissions = await Submission.find({
      user: req.user._id,
      problem: problem._id,
    }).lean();

    const totalSubmissions = await Submission.countDocuments({
      user: req.user._id,
      problem: req.params.id,
    }).lean();

    // In a real application, you might filter out hidden test cases here
    // based on user role or submission status.

    const isSolved = submissions?.some(
      (submission) => submission.status === "Accepted",
    );

    const solveStatus =
      submissions.length > 0
        ? isSolved
          ? "Accepted"
          : "Attempted"
        : "Unattempted";

    const updatedProblem = {
      ...problem,
      totalSubmissions,
      userSubmissions: submissions,
      solveStatus,
    };

    res.status(200).json({
      success: true,
      data: updatedProblem,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemByNumber = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ number: req.params.number }).lean();
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    const submissions = await Submission.find({
      user: req.user._id,
      problem: req.params.id,
    }).lean();

    const totalSubmissions = await Submission.countDocuments({
      user: req.user._id,
      problem: req.params.id,
    }).lean();

    // In a real application, you might filter out hidden test cases here
    // based on user role or submission status.

    const isSolved = submissions?.some(
      (submission) => submission.status === "Accepted",
    );

    const solveStatus =
      submissions.length > 0
        ? isSolved
          ? "Accepted"
          : "Attempted"
        : "Unattempted";

    const updatedProblem = {
      ...problem,
      totalSubmissions,
      userSubmissions: submissions,
      solveStatus,
    };
    res.status(200).json({ success: true, data: updatedProblem });
  } catch (error) {
    next(error);
  }
};

export const createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, message: "Problem deleted" });
  } catch (error) {
    next(error);
  }
};
