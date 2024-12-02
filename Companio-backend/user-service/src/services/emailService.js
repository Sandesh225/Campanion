// src/services/emailService.js

// import nodemailer from "nodemailer"; // Uncomment if using nodemailer for email sending

/**
 * Sends a password reset email to the user.
 * @param {String} email - Recipient's email address
 * @param {String} token - Password reset token
 */
export const sendPasswordResetEmail = async (email, token) => {
  // Implement email sending logic here
  // Example using nodemailer:
  /*
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
  */
  console.log(`Password reset email sent to ${email} with token ${token}`);
};

/**
 * Sends a verification email to the user.
 * Currently commented out as email verification is disabled.
 * @param {String} email - Recipient's email address
 * @param {String} token - Verification token
 */
export const sendVerificationEmail = async (email, token) => {
  // Implement email sending logic here
  // Example using nodemailer:
  /*
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the link below:\n\n${verifyUrl}`,
  };

  await transporter.sendMail(mailOptions);
  */
  console.log(`Verification email sent to ${email} with token ${token}`);
};
