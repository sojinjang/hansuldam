import nodemailer from "nodemailer";

// const user = process.env.GMAIL_ID;
// const pass = process.env.GMAIL_PASSWORD;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "dejaikeem@gmail.com",
    pass: "eresifkjbelszxnx",
  },
});
// 보안을 위해 .env했지만 안됨. jwt secret key도 그렇고 .env 사용 방법의 문제인듯?
const sendRandomPassword = (to, subject, text) =>
  new Promise((resolve, reject) => {
    const message = {
      from: "dejaikeem@gmail.com",
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
