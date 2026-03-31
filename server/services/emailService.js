const nodemailer = require('nodemailer');

// Check if email is configured
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && 
         process.env.EMAIL_PASS;
};

// Create email transporter only if configured
const getTransporter = () => {
  if (!isEmailConfigured()) {
    console.log('⚠️  Email not configured - skipping email notification');
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send reservation confirmation email
const sendReservationConfirmation = async (reservation) => {
  if (!isEmailConfigured()) {
    console.log('⚠️  Email service not configured - skipping confirmation email');
    console.log('📧 Would send to:', reservation.email);
    console.log('📧 Message: "Your table reservation has been confirmed as per your request"');
    return true; // Return true so reservation process continues
  }

  try {
    const transporter = getTransporter();
    if (!transporter) {
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservation.email,
      subject: 'Table Reservation Confirmed - Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🍽 Table Reservation Confirmed</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #333; margin-top: 0;">Dear ${reservation.name},</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Your table reservation has been <strong style="color: #16a34a;">confirmed</strong> as per your request.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #333; margin-top: 0;">📅 Reservation Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Date:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${reservation.date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Time:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${reservation.time}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Guests:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${reservation.guests} people</td>
                </tr>
                ${reservation.specialRequests ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Special Requests:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${reservation.specialRequests}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <h3 style="color: #333;">We look forward to serving you! 🍽</h3>
              <p style="color: #666; margin: 10px 0;">Thank you for choosing our restaurant</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${reservation.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return false;
  }
};

// Send registration confirmation email
const sendRegistrationConfirmation = async (user) => {
  if (!isEmailConfigured()) {
    console.log('⚠️  Email service not configured - skipping registration email');
    console.log('📧 Would send to:', user.email);
    console.log('📧 Message: "Welcome to our restaurant! Your registration was successful"');
    return true;
  }

  try {
    const transporter = getTransporter();
    if (!transporter) {
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Our Restaurant! - Registration Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Our Restaurant!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #333; margin-top: 0;">Dear ${user.name},</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thank you for registering with our restaurant! Your account has been <strong style="color: #16a34a;">successfully created</strong>.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #333; margin-top: 0;">📧 Your Account Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${user.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${user.email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Member Since:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h4 style="color: #856404; margin-top: 0;">🎁 What's Next?</h4>
              <ul style="color: #856404; margin: 10px 0; padding-left: 20px;">
                <li>Browse our delicious menu</li>
                <li>Make table reservations online</li>
                <li>Enjoy exclusive member benefits</li>
                <li>Order food for delivery or pickup</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <h3 style="color: #333;">We're excited to serve you! 🍽</h3>
              <p style="color: #666; margin: 10px 0;">Visit us anytime or order online!</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Registration email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending registration email:', error);
    return false;
  }
};

// Send order confirmation email
const sendOrderConfirmation = async (order, user) => {
  if (!isEmailConfigured()) {
    console.log('⚠️  Email service not configured - skipping order confirmation email');
    console.log('📧 Would send to:', user.email);
    console.log('📧 Message: "Your order has been confirmed and is being prepared"');
    return true;
  }

  try {
    const transporter = getTransporter();
    if (!transporter) {
      return false;
    }

    const orderItems = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Order Confirmed - Your Food is Being Prepared! 🍕',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🛒 Order Confirmed!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #333; margin-top: 0;">Dear ${user.name},</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Your order has been <strong style="color: #16a34a;">confirmed</strong> and is being prepared with fresh ingredients! 🍽
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #333; margin-top: 0;">📋 Order Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Order ID:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">#${order._id || order.id}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Date:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Status:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <span style="background: #16a34a; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                      ${order.status || 'Confirmed'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Payment:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <span style="background: #16a34a; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                      ${order.paymentStatus || 'Paid'}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">🍽 Order Items:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dc2626;">Item</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dc2626;">Qty</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dc2626;">Price</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dc2626;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItems}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 15px 10px; text-align: right; font-weight: bold; border-top: 2px solid #dc2626;">
                      Total Amount:
                    </td>
                    <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #dc2626; border-top: 2px solid #dc2626;">
                      ₹${order.totalAmount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
              <h4 style="color: #1976d2; margin-top: 0;">⏱ Estimated Delivery Time</h4>
              <p style="color: #1976d2; margin: 10px 0;">Your order will be ready in approximately <strong>30-45 minutes</strong>.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <h3 style="color: #333;">Thank you for your order! 🙏</h3>
              <p style="color: #666; margin: 10px 0;">We'll notify you when your food is ready for pickup/delivery.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return false;
  }
};

// Send reservation cancellation email
const sendReservationCancellation = async (reservation) => {
  if (!isEmailConfigured()) {
    console.log('⚠️  Email service not configured - skipping cancellation email');
    console.log('📧 Would send to:', reservation.email);
    console.log('📧 Message: "Your reservation has been cancelled"');
    return true;
  }

  try {
    const transporter = getTransporter();
    if (!transporter) {
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservation.email,
      subject: 'Reservation Cancelled - Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">❌ Reservation Cancelled</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #333; margin-top: 0;">Dear ${reservation.name},</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              We regret to inform you that your table reservation has been <strong style="color: #dc2626;">cancelled</strong>.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #333; margin-top: 0;">📅 Cancelled Reservation Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Date:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${reservation.date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Time:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${reservation.time}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Guests:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${reservation.guests} people</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Status:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <span style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                      Cancelled
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h4 style="color: #dc2626; margin-top: 0;">💝 We Apologize</h4>
              <p style="color: #dc2626; margin: 10px 0;">
                We sincerely apologize for any inconvenience caused. If you have any questions or would like to make a new reservation, please don't hesitate to contact us.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <h3 style="color: #333;">We hope to serve you soon! 🍽</h3>
              <p style="color: #666; margin: 10px 0;">Feel free to make a new reservation anytime</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${reservation.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
    return false;
  }
};

// Send order status notification email
const sendOrderStatusNotification = async (order, status) => {
  if (!isEmailConfigured()) {
    console.log('⚠️  Email service not configured - skipping order status email');
    console.log('📧 Would send to:', order.customerInfo?.email);
    console.log('📧 Message: `Order ${status} notification`');
    return true;
  }

  try {
    const transporter = getTransporter();
    if (!transporter) {
      return false;
    }

    const isConfirmed = status === 'confirmed';
    const isCancelled = status === 'cancelled';
    
    const subject = isConfirmed 
      ? 'Order Confirmed - Dine & Delight Restaurant' 
      : 'Order Cancelled - Dine & Delight Restaurant';

    const emailContent = isConfirmed ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order has been confirmed and is being prepared</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> #${order._id.slice(-6).toUpperCase()}</p>
            <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
            <p style="margin: 0 0 10px 0;"><strong>Table:</strong> ${order.customerInfo?.tableNumber ? `Table ${order.customerInfo.tableNumber}` : 'Takeaway/Delivery'}</p>
            <p style="margin: 0;"><strong>Total Amount:</strong> ₹${order.totalAmount?.toFixed(2)}</p>
          </div>
          
          <h3 style="color: #333;">Ordered Items:</h3>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb;">
            ${order.items?.map(item => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                <span>${item.name}</span>
                <span><strong>${item.quantity}x</strong> ₹${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('') || '<p>No items found</p>'}
          </div>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h4 style="color: #16a34a; margin-top: 0;">⏱️ Estimated Time</h4>
            <p style="color: #16a34a; margin: 10px 0;">
              Your order will be ready in approximately <strong>20-30 minutes</strong>. We'll notify you when it's ready for serving.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333;">Thank you for your order! 🍽️</h3>
            <p style="color: #666; margin: 10px 0;">We're preparing your food with care</p>
          </div>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">❌ Order Cancelled</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order has been cancelled</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <h2 style="color: #333; margin-top: 0;">Order Cancellation Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> #${order._id.slice(-6).toUpperCase()}</p>
            <p style="margin: 0 0 10px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 0 0 10px 0;"><strong>Cancelled On:</strong> ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 0;"><strong>Original Total:</strong> ₹${order.totalAmount?.toFixed(2)}</p>
          </div>
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h4 style="color: #dc2626; margin-top: 0;">💝 We Apologize</h4>
            <p style="color: #dc2626; margin: 10px 0;">
              We sincerely apologize for cancelling your order. If you have any questions or would like to place a new order, please don't hesitate to contact us.
            </p>
          </div>
          
          ${order.paymentStatus === 'paid' ? `
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h4 style="color: #92400e; margin-top: 0;">💰 Refund Information</h4>
              <p style="color: #92400e; margin: 10px 0;">
                Since you paid online, a full refund of ₹${order.totalAmount?.toFixed(2)} will be processed to your original payment method within 5-7 business days.
              </p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333;">We hope to serve you soon! 🍽️</h3>
            <p style="color: #666; margin: 10px 0;">Feel free to place a new order anytime</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.customerInfo?.email,
      subject: subject,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order ${status} email sent to ${order.customerInfo?.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending order ${status} email:`, error);
    return false;
  }
};

module.exports = {
  sendReservationConfirmation,
  sendRegistrationConfirmation,
  sendOrderConfirmation,
  sendReservationCancellation,
  sendOrderStatusNotification
};
