import nodemailer from 'nodemailer'

// emce qrgk rfxi aapp

const transporter = nodemailer.createTransport({
    host: 'smtp.taxcrm.in', // e.g., 'smtp.gmail.com'
    port: 587, // or 465 for secure SSL
    secure: false, // true for 465, false for other ports
    tls: { rejectUnauthorized: false },
    auth: {
        user: 'info@taxcrm.in',
        pass: 'SZHQBWm3', // or app-specific password
    },
});

export const sendBulkEmails = async (recipients, subject, html) => {
    for (const recipient of recipients) {
        const mailOptions = {
            from: 'info@taxcrm.in',
            to: recipient.email,
            subject,
            html: html,
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${recipient.email}: ${info.messageId}`);
        } catch (error) {
            console.error(`Error sending email to ${recipient.email}:`, error);
        }
    }
}

