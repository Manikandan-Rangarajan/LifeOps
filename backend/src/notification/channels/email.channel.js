import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const emailChannel = {
  send: async ({ user, title, message, meta }) => {
    if (!user?.email) {
      console.warn("⚠️ No email found for user:", user?._id);
      return;
    }

    await transporter.sendMail({
      from: `"LifeOps Reminder" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: title,
      html: `
        <h2>${title}</h2>
        <p>${message}</p>
        <p><strong>Scheduled Time:</strong> ${new Date(
          meta.eventTime
        ).toLocaleString()}</p>
      `,
    });

    console.log("📧 EMAIL SENT TO:", user.email);
  },
};

