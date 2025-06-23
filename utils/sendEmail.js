const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Library App" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      text,
    });

    console.log("Email sent to", email);
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

module.exports = sendEmail;
