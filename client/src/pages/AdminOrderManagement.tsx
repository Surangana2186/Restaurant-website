import React, { useState, useEffect } from 'react';
import './AdminOrderManagement.css';

interface Order {
  _id: string;
  items: OrderItem[];
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
  customer?: string; // For backward compatibility
}

interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
}

const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'preparing' | 'served' | 'completed' | 'cancelled'>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const apiUrl = `${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/orders/all`;
      console.log('🔄 Fetching orders from:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📊 Orders response:', data);
      console.log('📊 Orders count:', data.orders?.length || 0);
      
      // Log detailed order structure for debugging
      if (data.orders && data.orders.length > 0) {
        console.log('📋 First order structure:', data.orders[0]);
        console.log('📋 First order items:', data.orders[0].items);
        console.log('📋 First order status:', data.orders[0].status);
        console.log('📋 First order customerInfo:', data.orders[0].customerInfo);
      }
      
      if (data.success && data.orders) {
        setOrders(data.orders);
        console.log('✅ Orders loaded:', data.orders.length);
      } else {
        console.error('❌ Failed to fetch orders:', data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'confirmed' | 'preparing' | 'served' | 'completed' | 'cancelled') => {
    console.log('🔄 Updating order status:', { orderId, newStatus });
    setUpdatingOrderId(orderId);
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/orders/${orderId}/status`;
      console.log('📡 Calling API:', apiUrl);
      console.log('📤 Request body:', { status: newStatus });
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        console.log('✅ Order status updated successfully');
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to update order status:', errorData);
        alert(`Failed to update order status: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone and will remove the order from the database.')) {
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove order from local state
        setOrders(orders.filter(order => order._id !== orderId));
        alert('Order deleted successfully');
      } else {
        alert('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

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

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'preparing';
      case 'preparing': return 'served';
      case 'served': return 'completed';
      case 'completed': return null;
      case 'cancelled': return null;
      default: return null;
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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  return (
    <div className="admin-order-management">
      <div className="admin-container">
        <div className="admin-header">
          <h1>🍽️ Order Management</h1>
          <p>Manage and track all restaurant orders</p>
        </div>

        <div className="order-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders ({orders.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            ⏳ Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            ✅ Confirmed ({orders.filter(o => o.status === 'confirmed').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'preparing' ? 'active' : ''}`}
            onClick={() => setFilter('preparing')}
          >
            👨‍🍳 Preparing ({orders.filter(o => o.status === 'preparing').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'served' ? 'active' : ''}`}
            onClick={() => setFilter('served')}
          >
            🍽️ Served ({orders.filter(o => o.status === 'served').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            ✅ Completed ({orders.filter(o => o.status === 'completed').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            ❌ Cancelled ({orders.filter(o => o.status === 'cancelled').length})
          </button>
          <button 
            className="refresh-btn"
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              fetchOrders();
            }}
            disabled={loading}
          >
            🔄 Refresh ({loading ? 'Loading...' : 'Last: ' + new Date().toLocaleTimeString()})
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No orders found</h3>
            <p>No orders match the selected filter.</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-detail-card">
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-id">
                      <span className="label">Order #</span>
                      <span className="value">{order._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="order-date">
                      <span className="label">Date & Time</span>
                      <span className="value">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="order-status-section">
                    <label className="status-label">Order Status</label>
                    <select 
                      className={`status-dropdown ${order.status}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value as 'pending' | 'confirmed' | 'preparing' | 'served' | 'completed' | 'cancelled')}
                      disabled={updatingOrderId === order._id}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="preparing">👨‍🍳 Preparing</option>
                      <option value="served">🍽️ Served</option>
                      <option value="completed">✅ Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="order-content">
                  <div className="customer-section">
                    <h3>👤 Customer Information</h3>
                    <div className="customer-details">
                      <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{order.customerInfo?.name || 'Unknown Customer'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Table Number:</span>
                        <span className="detail-value table-number">
                          {order.customerInfo?.tableNumber ? `🪑 Table ${order.customerInfo.tableNumber}` : '📍 Takeaway/Delivery'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="order-items-section">
                    <h3>🍽️ Ordered Items</h3>
                    <div className="items-grid">
                      {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="item-card">
                            <div className="item-name">{item.name || 'Unknown Item'}</div>
                            <div className="item-details">
                              <span className="item-quantity">× {item.quantity || 1}</span>
                              {item.price && (
                                <span className="item-price">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-items">
                          <p>📦 No items available</p>
                          <small>Order items type: {typeof order.items}</small>
                          <small>Order items value: {JSON.stringify(order.items, null, 2)}</small>
                          <small>Order items length: {order.items?.length || 'N/A'}</small>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="order-payment-section">
                    <h3>💳 Payment Information</h3>
                    <div className="payment-details">
                      <div className="detail-row">
                        <span className="detail-label">Payment Method:</span>
                        <span className="detail-value payment-method">
                          {order.paymentStatus === 'paid' ? '💳 Paid Online' : '💵 Cash on Delivery'}
                        </span>
                      </div>
                      <div className="detail-row total-row">
                        <span className="detail-label">Total Amount:</span>
                        <span className="detail-value total-amount">₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="cancel-order-btn"
                    onClick={() => cancelOrder(order._id)}
                    disabled={updatingOrderId === order._id || order.status === 'cancelled'}
                  >
                    {updatingOrderId === order._id ? 'Processing...' : '❌ Cancel Order'}
                  </button>
                  <button
                    className="delete-order-btn"
                    onClick={() => deleteOrder(order._id)}
                    disabled={updatingOrderId === order._id}
                  >
                    {updatingOrderId === order._id ? 'Deleting...' : '🗑️ Delete Order'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderManagement;
