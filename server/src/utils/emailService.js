import sendEmail from "../config/email.js";
export const sendOtpEmail = async (to, otp) => {
  const subject = "OTP to reset your Cravings password";

  const message = `
  <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

    <div style="max-width:500px; margin:40px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

      <div style="background:#2563eb; padding:20px; text-align:center;">
        <h2 style="color:#ffffff; margin:0;">Cravings Security</h2>
      </div>

      <div style="padding:30px; color:#333333;">
        <p style="font-size:16px;">Hello,</p>

        <p style="font-size:15px; line-height:1.6;">
          Use the OTP below to reset your password.
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <div style="text-align:center; margin:30px 0;">
          <span style="
            display:inline-block;
            font-size:28px;
            letter-spacing:6px;
            padding:15px 30px;
            background:#f1f5f9;
            border-radius:8px;
            font-weight:bold;
            color:#111827;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px; color:#555;">
          If you didn’t request this, ignore this email.
        </p>

        <p style="margin-top:30px; font-size:14px;">
          — Team Cravings
        </p>
      </div>

      <div style="background:#f8fafc; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
        © 2026 Cravings. All rights reserved.
      </div>

    </div>

  </body>
`;

  await sendEmail(to, subject, message);
};
