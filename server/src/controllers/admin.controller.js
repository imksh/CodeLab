import { Problem } from "../models/problem.model.js";
import User from "../models/user.model.js";
import {Submission} from "../models/submission.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    
    // Recent users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt");
    
    // Submissions by status for charts
    const acceptedSubmissions = await Submission.countDocuments({ status: "Accepted" });
    const rejectedSubmissions = totalSubmissions - acceptedSubmissions;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProblems,
        totalSubmissions,
        recentUsers,
        submissionsChart: [
          { name: "Accepted", value: acceptedSubmissions },
          { name: "Rejected", value: rejectedSubmissions }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createProblem = async (req, res, next) => {
  try {
    const problemData = { ...req.body };
    
    // Parse JSON fields since it's multipart/form-data
    if (problemData.tags && typeof problemData.tags === 'string') problemData.tags = JSON.parse(problemData.tags);
    if (problemData.companies && typeof problemData.companies === 'string') problemData.companies = JSON.parse(problemData.companies);
    if (problemData.topics && typeof problemData.topics === 'string') problemData.topics = JSON.parse(problemData.topics);
    if (problemData.examples && typeof problemData.examples === 'string') problemData.examples = JSON.parse(problemData.examples);
    if (problemData.testCases && typeof problemData.testCases === 'string') problemData.testCases = JSON.parse(problemData.testCases);
    if (problemData.hints && typeof problemData.hints === 'string') problemData.hints = JSON.parse(problemData.hints);
    if (problemData.starterCode && typeof problemData.starterCode === 'string') problemData.starterCode = JSON.parse(problemData.starterCode);
    if (problemData.driverCode && typeof problemData.driverCode === 'string') problemData.driverCode = JSON.parse(problemData.driverCode);
    if (problemData.solution && typeof problemData.solution === 'string') problemData.solution = JSON.parse(problemData.solution);

    const attachmentFile = req.file;
    if (attachmentFile) {
      const cloudinaryRes = await uploadToCloudinary(attachmentFile.path);
      if (cloudinaryRes) {
        problemData.attachment = {
          url: cloudinaryRes.secure_url,
          publicId: cloudinaryRes.public_id,
          type: problemData.attachmentType || "raw" 
        };
      }
    } else if (problemData.attachmentUrl) {
      problemData.attachment = {
        url: problemData.attachmentUrl,
        type: "url"
      };
    }

    const newProblem = await Problem.create(problemData);
    res.status(201).json({ success: true, data: newProblem });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const problemData = { ...req.body };
    
    // Parse JSON fields
    if (problemData.tags && typeof problemData.tags === 'string') problemData.tags = JSON.parse(problemData.tags);
    if (problemData.companies && typeof problemData.companies === 'string') problemData.companies = JSON.parse(problemData.companies);
    if (problemData.topics && typeof problemData.topics === 'string') problemData.topics = JSON.parse(problemData.topics);
    if (problemData.examples && typeof problemData.examples === 'string') problemData.examples = JSON.parse(problemData.examples);
    if (problemData.testCases && typeof problemData.testCases === 'string') problemData.testCases = JSON.parse(problemData.testCases);
    if (problemData.hints && typeof problemData.hints === 'string') problemData.hints = JSON.parse(problemData.hints);
    if (problemData.starterCode && typeof problemData.starterCode === 'string') problemData.starterCode = JSON.parse(problemData.starterCode);
    if (problemData.driverCode && typeof problemData.driverCode === 'string') problemData.driverCode = JSON.parse(problemData.driverCode);
    if (problemData.solution && typeof problemData.solution === 'string') problemData.solution = JSON.parse(problemData.solution);

    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const attachmentFile = req.file;
    if (attachmentFile) {
      if (problem.attachment && problem.attachment.publicId) {
         await deleteFromCloudinary(problem.attachment.publicId, "raw");
      }
      const cloudinaryRes = await uploadToCloudinary(attachmentFile.path);
      if (cloudinaryRes) {
        problemData.attachment = {
          url: cloudinaryRes.secure_url,
          publicId: cloudinaryRes.public_id,
          type: problemData.attachmentType || "raw"
        };
      }
    } else if (problemData.attachmentUrl) {
      problemData.attachment = {
        url: problemData.attachmentUrl,
        type: "url"
      };
    }

    const updatedProblem = await Problem.findByIdAndUpdate(id, problemData, { new: true });
    res.status(200).json({ success: true, data: updatedProblem });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.attachment && problem.attachment.publicId) {
      await deleteFromCloudinary(problem.attachment.publicId, "raw");
    }

    await Problem.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Problem deleted" });
  } catch (error) {
    next(error);
  }
};