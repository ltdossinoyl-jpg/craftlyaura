require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.sendMail({
    from: `"Craftly Aura" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'Test - Craftly Aura Notifications Active',
    html: `<h2>Craftly Aura - Email Notifications</h2>
        <p>Email notifications are now <strong>active</strong>.</p>
        <p>You will receive emails for:</p>
        <ul>
            <li>Contact form submissions</li>
            <li>Chat messages</li>
            <li>Stock notification requests</li>
        </ul>
        <p style="color:#888;font-size:12px;">This is a test email from your Craftly Aura backend.</p>`,
}).then(() => {
    console.log('Test email sent successfully to ' + process.env.ADMIN_EMAIL);
    process.exit(0);
}).catch((err) => {
    console.error('Failed to send:', err.message);
    process.exit(1);
});
