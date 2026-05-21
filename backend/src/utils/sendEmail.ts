import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465, // Use 465 with secure: true instead of 587
    secure: true,
    auth: {
      user: process.env.SMTP_USER?.replace('agmail.com', '@gmail.com'),
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: (process.env.EMAIL_FROM || process.env.SMTP_USER)?.replace('agmail.com', '@gmail.com'),
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
