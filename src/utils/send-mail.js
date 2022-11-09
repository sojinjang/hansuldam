import nodemailer from "nodemailer";

const user = process.env.GMAIL_ID;
const pass = process.env.GMAIL_PASSWORD;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user,
    pass,
  },
});

const sendRandomPassword = (to, subject, text) =>
  new Promise((resolve, reject) => {
    const message = {
      from: user,
      to,
      subject,
      text,
    };

    transport.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(info);
    });
  });

export { sendRandomPassword };
