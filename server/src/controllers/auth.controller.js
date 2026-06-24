import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { genToken } from "../utils/authToken.js";
import Otp from "../models/otp.model.js";
import { sendOtpEmail } from "../utils/emailService.js";
import genOtpToken from "../utils/genOtpToken.js";
import cloudinary from "../config/cloudinary.js";
import {Submission}  from "../models/submission.model.js";
import { Problem } from "../models/problem.model.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!email || !phone || !password || !name || !role) {
      return next({
        status: 400,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User Already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const photoURL = `https://placehold.co/600x400?text=${name.charAt(0).toUpperCase()}`;

    const photo = {
      url: photoURL,
    };

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      role,
      password: hashedPassword,
      photo,
    });

    res.status(201).json({ message: "Registration Successful", data: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next({
        status: 400,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, existingUser.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    //Token Generation
    await genToken(existingUser, res);

    res.status(200).json({ message: "Login successfully", data: existingUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log("Error in signup controller", error);
    next(error);
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "User authenticated", data: user });
  } catch (error) {
    console.log("Error in signup controller", error);
    next(error);
  }
};

export const genOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next({
        status: 400,
        message: "Email is required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      await existingOtp.deleteOne();
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);
    const result = await Otp.create({
      email,
      otp: hashedOtp,
    });

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "Otp sent successfully" });
  } catch (error) {
    console.log("Error in genOtp: ", error);
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next({
        status: 400,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp) {
      return next({
        status: 400,
        message: "OTP match failed",
      });
    }

    const isMatched = await bcrypt.compare(otp, existingOtp.otp);

    if (!isMatched) {
      return next({
        status: 400,
        message: "OTP match failed",
      });
    }

    await genOtpToken(existingUser, res);

    res.status(200).json({ message: "Otp verified successfully" });
  } catch (error) {
    console.log("Error in genOtp: ", error);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const currentUser = req.user;
    if (!newPassword) {
      return next({
        status: 400,
        message: "All fields are required.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    currentUser.password = hashedPassword;

    await currentUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in genOtp: ", error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const cldRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "codelab/avatars",
      });

      if (user.avatar && user.avatar.publicId) {
        await cloudinary.uploader
          .destroy(user.avatar.publicId)
          .catch((err) => console.log(err));
      }

      user.avatar = {
        url: cldRes.secure_url,
        publicId: cldRes.public_id,
      };
    }

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({
      user: userId,
    })
      .populate({
        path: "problem",
        select: "number title difficulty",
      })
      .sort({ createdAt: -1 })
      .limit(10);

    const recentSubmissions = submissions.map((submission) => ({
      id: submission._id,
      problemNumber: submission.problem?.number,
      title: submission.problem?.title,
      status: submission.status,
      createdAt: submission.createdAt,
    }));

    const totalSubmissions = submissions.length;

    const acceptedSubmissions = submissions.filter(
      (sub) => sub.status === "Accepted",
    );

    const acceptedSubmissionsCount = acceptedSubmissions.length;

    // Problems attempted (unique)
    const submittedProblemIds = [
      ...new Set(submissions.map((sub) => sub.problem?._id?.toString()).filter(Boolean)),
    ];

    // Problems solved (unique accepted)
    const solvedProblemIds = [
      ...new Set(acceptedSubmissions.map((sub) => sub.problem?._id?.toString()).filter(Boolean)),
    ];

    const attemptedSubmissionsCount = submissions.filter(
      (sub) => sub.status !== "Accepted",
    ).length;

    const submittedProblems = submittedProblemIds.length;

    const solvedProblems = await Problem.find({
      _id: { $in: solvedProblemIds },
    }).select("difficulty");

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    solvedProblems.forEach((problem) => {
      switch (problem.difficulty) {
        case "EASY":
          easySolved++;
          break;
        case "MEDIUM":
          mediumSolved++;
          break;
        case "HARD":
          hardSolved++;
          break;
      }
    });

    const acceptanceRate =
      totalSubmissions > 0
        ? Number(
            ((acceptedSubmissionsCount / totalSubmissions) * 100).toFixed(1),
          )
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        submittedProblems,
        acceptedSubmissions: acceptedSubmissionsCount,
        attemptedSubmissions: attemptedSubmissionsCount,
        recentSubmissions,
        acceptanceRate,
        difficultyBreakdown: {
          easy: easySolved,
          medium: mediumSolved,
          hard: hardSolved,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
