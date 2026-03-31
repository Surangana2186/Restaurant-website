import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Payment.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment: React.FC = () => {
  const history = useHistory();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const items = JSON.parse(cart);
      setCartItems(items);
      const sum = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
      setTotal(sum);
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const calculateFinalAmount = () => {
    const subtotal = total;
    const serviceCharge = 50; // Table service charge
    const tax = subtotal * 0.05;
    return subtotal + serviceCharge + tax;
  };

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer details');
      return;
    }

    setLoading(true);

    try {
      await loadRazorpayScript();

      const options = {
        key: 'rzp_live_SXwULl4VkmKLMB', // Your live Razorpay key
        amount: calculateFinalAmount() * 100, // Convert to paise
        currency: 'INR',
        name: 'Dine n Delight',
        description: 'Food Order Payment',
        image: 'https://restaurant-website-pea7.vercel.app/logo.png', // Live logo URL
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        theme: {
          color: '#dc2626' // Match your restaurant theme
        },
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          
          // Send payment details to backend for verification
          fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_id: response.razorpay_payment_id,
              amount: calculateFinalAmount() * 100,
              customer_info: customerInfo,
              order_details: cartItems
            })
          }).then(res => res.json())
            .then(data => {
              if (data.success) {
                // Clear cart
                localStorage.removeItem('cart');
                // Redirect to success page
                history.push('/payment-success');
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            })
            .catch(error => {
              console.error('Payment verification error:', error);
              alert('Payment verification failed. Please contact support.');
            });
        },
        modal: {
          ondismiss: function() {
            alert('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Secure Payment</h1>
        <p>Complete your order details securely</p>
      </div>

      <div className="payment-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item: any, index: number) => (
            <div key={index} className="order-item">
              <span className="item-name">{item.name} x {item.quantity}</span>
              <span className="item-price">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{total}</span>
            </div>
            <div className="total-row">
              <span>Service Charge:</span>
              <span>₹50</span>
            </div>
            <div className="total-row">
              <span>Tax (5%):</span>
              <span>₹{(total * 0.05).toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span>₹{calculateFinalAmount()}</span>
            </div>
          </div>
        </div>

        <div className="customer-details">
          <h2>Customer Information</h2>
          <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>
            <button type="submit" className="pay-btn" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${calculateFinalAmount()}`}
            </button>
          </form>
        </div>
      </div>

      <div className="payment-info">
        <h3>Secure Payment Gateway</h3>
        <p>Your payment is processed securely through Razorpay</p>
        <div className="payment-methods">
          <div className="payment-method">
            <span className="method-icon">💳</span>
            <span>Credit/Debit Cards</span>
          </div>
          <div className="payment-method">
            <span className="method-icon">📱</span>
            <span>UPI</span>
          </div>
          <div className="payment-method">
            <span className="method-icon">🏦</span>
            <span>Net Banking</span>
          </div>
          <div className="payment-method">
            <span className="method-icon">📧</span>
            <span>Razorpay Wallet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
