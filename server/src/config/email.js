// import dotenv from "dotenv";
// dotenv.config();
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSCODE,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      html: message,
    };

    const res = await transporter.sendMail(mailOptions);
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;

// sendEmail(
//   "karan03945@gmail.com",
//   "Test Email",
//   "<p style='color:red;'>Hello, this is a test email from your</p>",
// );

