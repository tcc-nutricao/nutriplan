import nodemailer from 'nodemailer';

export async function useSendMail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILJET_API_KEY,
      pass: process.env.MAILJET_API_SECRET
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    ...(html && { html })
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new AppError('Erro ao enviar e-mail: ' + error.message);
  }
}