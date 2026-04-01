import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Cart.css';

interface CartItem {
  _id?: string;
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

const Cart = () => {
  const history = useHistory();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      calculateTotal(items);
    }
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => {
      const itemId = item._id || item.id;
      return itemId === id ? { ...item, quantity: newQuantity } : item;
    });
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const removeItem = (id: string | number) => {
    const updatedItems = cartItems.filter(item => {
      // Handle both _id and id cases
      const itemId = item._id || item.id;
      return itemId !== id;
    });
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
    
    // Show removal notification
    const message = document.createElement('div');
    message.className = 'cart-removal-message';
    message.textContent = 'Item removed from cart!';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 2000);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setTotal(0);
  };

  const proceedToPayment = () => {
    // Validate inputs
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!customerEmail.trim()) {
      alert('Please enter your email');
      return;
    }
    
    if (!customerEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!tableNumber.trim()) {
      alert('Please select a table number');
      return;
    }
    
    // Save order details to localStorage
    const orderDetails = {
      tableNumber: tableNumber.trim(),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      items: cartItems,
      subtotal: total,
      serviceCharge: 5,
      tax: total * 0.05,
      totalAmount: total + 5 + (total * 0.05),
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'pending' : 'cod',
      status: 'pending'
    };
    
    localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
    
    if (paymentMethod === 'online') {
      // Go to payment page for online payment
      history.push('/payment');
    } else {
      // For COD, create order directly
      createCODOrder(orderDetails);
    }
  };

  const createCODOrder = async (orderDetails: any) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store user email for order tracking
        localStorage.setItem('userEmail', orderDetails.customerEmail);
        sessionStorage.setItem('userEmail', orderDetails.customerEmail);
        
        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('currentOrder');
        
        alert('✅ Order placed successfully! Your order will be delivered to your table.');
        
        // Redirect to order management
        history.push('/orders');
      } else {
        alert('❌ Failed to place order: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating COD order:', error);
      alert('❌ Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <div className="cart-container">
          <div className="cart-empty">
            <h1>Your Table Order is Empty</h1>
            <p>Add some delicious items from our menu for table delivery!</p>
            <a href="/menu" className="continue-shopping-btn">
              Browse Menu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-container">
        <div className="cart-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Table Order</h1>
              <p>{cartItems.length} items</p>
            </div>
            <button 
              onClick={() => history.push('/orders')}
              className="my-orders-btn"
            >
              📋 My Orders
            </button>
          </div>
        </div>

        <div className="table-info">
          <div className="customer-info">
            <h3>Customer Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="customer-input"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="customer-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Table Number *</label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="table-select"
                  required
                >
                  <option value="">Select a table...</option>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={`T${num}`}>
                      Table T{num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="payment-method-section">
              <h4>💳 Payment Method</h4>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod('online')}
                  />
                  <div className="payment-details">
                    <span className="payment-icon">💳</span>
                    <span className="payment-text">Pay Online</span>
                    <span className="payment-desc">Pay with Razorpay, Credit/Debit Cards, UPI</span>
                  </div>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod('cod')}
                  />
                  <div className="payment-details">
                    <span className="payment-icon">💵</span>
                    <span className="payment-text">Cash on Delivery</span>
                    <span className="payment-desc">Pay when order arrives at your table</span>
                  </div>
                </label>
              </div>
            </div>
            
            <p className="table-note">📝 Your order will be delivered to your table</p>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item._id || item.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="my-orders-section">
            <button 
              onClick={() => history.push('/orders')}
              className="my-orders-main-btn"
            >
              📋 View My Orders
            </button>
            <p className="my-orders-desc">Track your order status and history</p>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Table Service Charge:</span>
                <span>₹5.00</span>
              </div>
              <div className="summary-row">
                <span>Tax (GST 5%):</span>
                <span>₹{(total * 0.05).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{(total + 5 + (total * 0.05)).toFixed(2)}</span>
              </div>
              <button 
                onClick={clearCart}
                className="clear-cart-btn"
              >
                Clear Cart
              </button>
              <button 
                onClick={proceedToPayment}
                className="proceed-payment-btn"
              >
                {paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order (Cash on Delivery)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
