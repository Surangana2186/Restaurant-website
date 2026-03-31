const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form submission with email notification
router.post('/', async (req, res) => {
    try {
        const { fullName, email, phone, subject, message } = req.body;
        
        console.log('Contact form submission:', { fullName, email, phone, subject, message });
        console.log('Email configuration check:');
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('HOST_EMAIL:', process.env.HOST_EMAIL);
        console.log('EMAIL_PASS configured:', process.env.EMAIL_PASS ? 'YES' : 'NO');
        
        // Test transporter connection
        await transporter.verify();
        console.log('Transporter verified successfully');
        
        // Email content for the restaurant host
        const hostEmailContent = `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
        `;
        
        // Email content for the customer (auto-reply)
        const customerEmailContent = `
            <h2>Thank You for Contacting Dine & Delight!</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your Message Details:</strong></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
            <br>
            <p>Best regards,<br>
            The Dine & Delight Team</p>
            <hr>
            <p><small>This is an automated message. Please do not reply to this email.</small></p>
        `;
        
        // Send email to restaurant host
        const hostMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.HOST_EMAIL,
            subject: `New Contact: ${subject} - ${fullName}`,
            html: hostEmailContent
        };
        
        // Send confirmation email to customer
        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank You for Contacting Dine & Delight',
            html: customerEmailContent
        };
        
        // Send both emails
        console.log('Sending email to host...');
        await transporter.sendMail(hostMailOptions);
        console.log('Host email sent successfully');
        
        console.log('Sending email to customer...');
        await transporter.sendMail(customerMailOptions);
        console.log('Customer email sent successfully');
        
        console.log('Emails sent successfully to host and customer');
        
        res.status(200).json({ 
            message: 'Message sent successfully! We will get back to you soon.' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            message: 'Error sending message. Please try again later.' 
        });
    }
});

module.exports = router;
