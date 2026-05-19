import { Request, Response, NextFunction } from 'express';
import sendEmail from '../utils/sendEmail';

/**
 * @route   POST /api/enquiry
 * @desc    Send an enquiry email
 * @access  Public
 */
export const submitEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ success: false, message: 'Please provide all required fields' });
      return;
    }

    const adminEmail = (process.env.EMAIL_TO || process.env.SMTP_USER)?.replace('ayopmail.com', '@yopmail.com').replace('agmail.com', '@gmail.com');

    if (!adminEmail) {
      res.status(500).json({ success: false, message: 'Admin email not configured' });
      return;
    }

    const emailMessage = `
You have received a new enquiry from the KPaint website.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `;

    await sendEmail({
      email: adminEmail,
      subject: `[KPaint Enquiry] ${subject}`,
      message: emailMessage,
    });

    res.status(200).json({ success: true, message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Error sending enquiry email:', error);
    res.status(500).json({ success: false, message: 'Failed to send enquiry. Please try again later.' });
  }
};
