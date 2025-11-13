import nodemailer from 'nodemailer'

// emce qrgk rfxi aapp

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com'
    port: 587, // or 465 for secure SSL
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'parth.taxfile@gmail.com',
        pass: 'emce qrgk rfxi aapp', // or app-specific password
    },
});

const recipients = [
    { name: 'jay', email: 'jay01.monarch@gmail.com' },
    { name: 'ankit', email: 'bob01.monarch@gmail.com' },
    { name: 'sudhitt', email: 'hiren01.monarch@gmail.com' },
    { name: 'hirent', email: 'sudhit01.monarch@gmail.com' },
];

async function sendBulkEmails(recipients) {
    for (const recipient of recipients) {
        const mailOptions = {
            from: 'parth.taxfile@gmail.com',
            to: recipient.email,
            subject: 'Hello from Node.js!',
            html: `<p>Hi ${recipient.name},</p><p>This is a bulk email example.</p>`,
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${recipient.email}: ${info.messageId}`);
        } catch (error) {
            console.error(`Error sending email to ${recipient.email}:`, error);
        }
    }
}


sendBulkEmails();