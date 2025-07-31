import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendOTP = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Note Buddy" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🔐 Verify your email - OTP Code Inside",
      text: `Your OTP code is: ${otp}`, // Fallback for email clients that don't support HTML
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center;">Your Note Buddy Welcomes You 🎉</h2>
      <p style="font-size: 16px; color: #444;">To complete your registration, please use the following One-Time Password (OTP):</p>
      <div style="font-size: 24px; font-weight: bold; color: #fff; background-color: #007bff; padding: 10px 20px; text-align: center; border-radius: 8px; letter-spacing: 2px;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        This OTP is valid for 5 minutes. If you did not request this, please ignore this email.
      </p>
      <p style="font-size: 14px; color: #aaa; text-align: center; margin-top: 30px;">
        &copy; ${new Date().getFullYear()} Note Buddy. All rights reserved.
      </p>
    </div>
  `,
    });

    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendOTP };
