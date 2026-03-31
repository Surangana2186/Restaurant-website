import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      history.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [history]);

  return (
    <div className="payment-success">
      <div className="success-container">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>
        
        <div className="success-content">
          <h1>Payment Successful!</h1>
          <p>Thank you for your order. We've received your payment and will start preparing your delicious food.</p>
          
          <div className="order-details">
            <h2>What's Next?</h2>
            <ul>
              <li>You'll receive an order confirmation email shortly</li>
              <li>Our team will prepare your order with care</li>
              <li>You'll receive real-time updates on your order status</li>
              <li>Estimated delivery time: 30-45 minutes</li>
            </ul>
          </div>

          <div className="success-actions">
            <button 
              onClick={() => history.push('/orders')}
              className="track-order-btn"
            >
              📋 Track My Order
            </button>
            <button 
              onClick={() => history.push('/menu')}
              className="menu-btn"
            >
              Order More
            </button>
            <button 
              onClick={() => history.push('/')}
              className="home-btn"
            >
              Back to Home
            </button>
          </div>
        </div>
        
        <div className="redirect-message">
          <p>Redirecting to home page in <span className="countdown">5</span> seconds...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
