import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const protectedRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next({
        status: 401,
        message: "Unauthorized! No token ptovided",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next({
        status: 401,
        message: "Unauthorized! Token expired",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next({
        status: 401,
        message: "Unauthorized user",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in Auth middleware: ", error);
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next({
      status: 403,
      message: "Forbidden! Admin access required.",
    });
  }
};

export default protectedRoutes;
