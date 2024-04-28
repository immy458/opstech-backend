const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetRequestEmail = async (link, userEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `OPSTECH <${process.env.EMAIL_ID}>`,
      to: userEmail,
      subject: "Password Reset Request",
      text: `You have requested to reset your password. Please click on the link below to reset your password. The link will be valid for 20 minutes.`,
      html: `
        <p>Hello,</p>
        <p>You have requested to reset your password. Please click on the link below to reset your password.</p>
        <p><a href="${link}" target="_blank" rel="noopener noreferrer">Click here to reset your password</a></p>
        <p>The link will be valid for 20 minutes.</p>
        <p>If you did not request this password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>OPSTECH</p>
      `,
    });

    console.log(`Email sent successfully to '${userEmail}'. Message Id: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email to user: ", userEmail, error);
    throw error;
  }
};

const sendPasswordResetSuccessfullEmail = async (userEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `OPSTECH <${process.env.EMAIL_ID}>`,
      to: userEmail,
      subject: "Password Reset Successful",
      text: `Your password has been successfully reset.`,
      html: `
        <p>Hello,</p>
        <p>Your password has been successfully reset.</p>
        <p>If you did not request this password reset, please contact us immediately.</p>
        <p>Best regards,<br>OPSTECH</p>
      `,
    });

    console.log(`Email sent successfully to '${userEmail}'. Message Id: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email to user:", userEmail, error);
    throw error;
  }
};

module.exports = { sendPasswordResetRequestEmail, sendPasswordResetSuccessfullEmail };
