import jwt from "jsonwebtoken";

const genOtpToken = async (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.cookie("otpToken", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default genOtpToken;
