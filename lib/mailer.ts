import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const sendOTP = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Your App Name" <no-reply@yourapp.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      html: `<h3>Your OTP code is: <b>${otp}</b></h3>`,
    });

    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendOTP };
