const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailService() {
  console.log('📧 Testing Email Service Configuration...\n');

  // Check environment variables
  console.log('Environment Variables:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
  console.log('HOST_EMAIL:', process.env.HOST_EMAIL ? '✅ Set' : '❌ Missing');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n❌ Email service not properly configured!');
    console.log('Please check your .env file for EMAIL_USER and EMAIL_PASS');
    process.exit(1);
  }

  console.log('\n🔧 Creating email transporter...');
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ Transporter created successfully');

    // Test connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '📧 Email Service Test - Dine n Delight',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">🎉 Email Service Working!</h2>
          <p>Your email service is configured correctly and ready to send notifications.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #333; margin-top: 0;">Test Details:</h3>
            <ul style="color: #666;">
              <li>✅ SMTP Connection: Success</li>
              <li>✅ Authentication: Success</li>
              <li>✅ Email Ready: Yes</li>
            </ul>
          </div>
          <p style="color: #666; font-size: 14px;">
            This is a test email from your Dine n Delight restaurant system.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Dine n Delight Restaurant Management System<br>
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    console.log('📤 Sending test email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', result.messageId);
    console.log('📧 To:', process.env.EMAIL_USER);
    
    console.log('\n🎉 Email service is working perfectly!');
    console.log('📧 Reservation and order confirmation emails should now work.');

  } catch (error) {
    console.error('❌ Email service test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check Gmail App Password (not regular password)');
    console.log('2. Enable 2-factor authentication on Gmail');
    console.log('3. Use "App Password" for Gmail SMTP');
    console.log('4. Check firewall/antivirus blocking SMTP');
  }
}

testEmailService();
