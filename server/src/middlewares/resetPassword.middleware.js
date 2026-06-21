import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const resetPasswordMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.otpToken;

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

    if(!user){
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

export default resetPasswordMiddleware;
