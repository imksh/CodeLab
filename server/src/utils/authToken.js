import jwt from "jsonwebtoken";

export const genToken = async (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role || "admin",
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    //expires in day=1d,in hour=1h,in seconds=1

    console.log(token);
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: process.env.NODE_ENV !== "production" ? false : true,
      secure: process.env.NODE_ENV !== "production" ? false : true,
      sameSite: process.env.NODE_ENV !== "production" ? "lax" : "none",
    });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
