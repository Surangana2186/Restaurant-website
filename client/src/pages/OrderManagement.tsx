import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './OrderManagement.css';

interface Order {
  _id: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'served' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'cod' | 'pending';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    tableNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const OrderManagement: React.FC = () => {
  const history = useHistory();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'preparing' | 'served' | 'completed' | 'cancelled'>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchOrders();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
      if (!userEmail) {
        history.push('/login');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/orders/user/${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
        setLastRefresh(new Date());
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#3498db';
      case 'preparing': return '#9b59b6';
      case 'served': return '#2ecc71';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'confirmed': return '✅ Confirmed';
      case 'preparing': return '👨‍🍳 Preparing';
      case 'served': return '🍽️ Served';
      case 'completed': return '✅ Completed';
      case 'cancelled': return '❌ Cancelled';
      default: return status;
    }
  };

  const getPaymentText = (status: string) => {
    switch (status) {
      case 'paid': return '💳 Paid Online';
      case 'cod': return '💵 Cash on Delivery';
      case 'pending': return '⏳ Payment Pending';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-management">
      <div className="order-container">
        <div className="order-header">
          <div className="header-content">
            <div className="header-text">
              <h1>📋 My Orders</h1>
              <p>Track and manage your restaurant orders</p>
            </div>
            <div className="header-controls">
              <button 
                onClick={fetchOrders}
                className="refresh-btn"
                disabled={loading}
              >
                🔄 Refresh
              </button>
              <div className="last-refresh">
                <small>Last updated: {lastRefresh.toLocaleTimeString()}</small>
              </div>
            </div>
          </div>
        </div>

        <div className="order-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            ⏳ Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            ✅ Confirmed
          </button>
          <button 
            className={`filter-btn ${filter === 'preparing' ? 'active' : ''}`}
            onClick={() => setFilter('preparing')}
          >
            👨‍🍳 Preparing
          </button>
          <button 
            className={`filter-btn ${filter === 'served' ? 'active' : ''}`}
            onClick={() => setFilter('served')}
          >
            🍽️ Served
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            ✅ Completed
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            ❌ Cancelled
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet. Start by ordering from our menu!</p>
            <button 
              className="order-now-btn"
              onClick={() => history.push('/menu')}
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="simple-order-card">
                <div className="order-header-info">
                  <div className="order-basic-info">
                    <div className="order-id">
                      <span className="label">Order #</span>
                      <span className="value">#{order._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  <div className="order-amount">
                    <span className="label">Total:</span>
                    <span className="value">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-items-simple">
                  <h4>🍽️ Items</h4>
                  <div className="items-simple-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="simple-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">× {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-time">
                  <span className="label">Order Time:</span>
                  <span className="value">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
