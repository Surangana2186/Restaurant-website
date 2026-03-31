import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './AdminDashboard.css';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AdminDashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>Something went wrong</h2>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AdminDashboard = () => {
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('orders');
  const [stats, setStats] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'main-course',
    price: '',
    description: '',
    image: '',
    isVeg: true
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    // Add a small delay to ensure localStorage is available
    const timer = setTimeout(async () => {
      // Check if admin is logged in
      const adminToken = localStorage.getItem('adminToken');
      const adminEmail = localStorage.getItem('adminEmail');
      
      console.log('AdminDashboard - Checking auth:', { adminToken, adminEmail });
      
      if (!adminToken || !adminEmail) {
        console.log('AdminDashboard - Not authenticated, redirecting to admin login');
        // Redirect to admin login page if not authenticated
        history.push('/login?admin=true');
        return;
      }

      console.log('AdminDashboard - Authenticated, loading dashboard data');
      setAuthChecking(false);
      
      // Load data sequentially to avoid race conditions
      try {
        // Add timeout to prevent infinite loading
        const dataLoadingTimeout = setTimeout(() => {
          console.warn('Data loading timeout - forcing loading to false');
          setLoading(false);
        }, 10000); // 10 second timeout

        await fetchRegisteredUsers();
        console.log('Users loaded');
        await fetchMenuItems();
        console.log('Menu items loaded');
        await fetchDashboardData();
        console.log('Dashboard data loaded');
        await fetchReservations();
        console.log('Reservations loaded');
        
        clearTimeout(dataLoadingTimeout);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
        console.log('Initial data loading completed');
      }
    }, 100); // 100ms delay

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Refresh data function
  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchRegisteredUsers();
      await fetchMenuItems();
      await fetchDashboardData();
      await fetchReservations();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }; // Empty dependency array for async useEffect

  // Real-time updates - refresh users every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'users') {
        fetchRegisteredUsers();
      }
      if (activeTab === 'reservations') {
        fetchReservations();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleViewUser = (user: any) => {
    alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role || "user"}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}`);
  };

  const handleDeleteUser = async (userId: any) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/auth/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Refresh users list
          fetchRegisteredUsers();
          alert('User deleted successfully');
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const fetchRegisteredUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/auth/users`);
      const users = await response.json();
      console.log('Fetched registered users:', users);
      setRegisteredUsers(users);
      
      // Update stats with real user count
      setStats(prevStats => [
        { ...prevStats[0], value: users.length.toLocaleString() },
        ...prevStats.slice(1)
      ]);
    } catch (error) {
      console.error('Error fetching registered users:', error);
      setRegisteredUsers([]);
    }
  };

  const fetchReservations = async () => {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/reservations?t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`Reservations fetch failed: ${response.status}`);
      }
      const reservationsData = await response.json();
      console.log('📋 Fetched reservations from server:', reservationsData.map((r: any) => ({ id: r._id, name: r.name, status: r.status })));
      setReservations(reservationsData || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/admin/menu`);
      if (!response.ok) {
        throw new Error(`Menu items fetch failed: ${response.status}`);
      }
      const data = await response.json();
      setMenuItems(data.menuItems || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
    }
  };

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const [statsResponse, ordersResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/admin/stats`),
        fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/orders/all`)
      ]);

      console.log('Stats response:', statsResponse.status);
      console.log('Orders response:', ordersResponse.status);

      if (!statsResponse.ok) {
        throw new Error(`Stats fetch failed: ${statsResponse.status}`);
      }
      if (!ordersResponse.ok) {
        throw new Error(`Orders fetch failed: ${ordersResponse.status}`);
      }

      const statsData = await statsResponse.json();
      const ordersData = await ordersResponse.json();

      console.log('Stats data:', statsData);
      console.log('Orders data:', ordersData);

      // Store orders in state
      if (ordersData.success && ordersData.orders) {
        setOrders(ordersData.orders);
      }

      // Set real-time stats based on actual database data
      const realStats = statsData.success && statsData.stats ? statsData.stats : {
        totalUsers: registeredUsers.length,
        totalOrders: ordersData.success ? ordersData.orders.length : 0,
        totalReservations: reservations.length,
        totalMenuItems: menuItems.length
      };

      setStats([
        { title: 'Total Users', value: realStats.totalUsers.toLocaleString(), icon: '👥' },
        { title: 'Reservations', value: realStats.totalReservations.toLocaleString(), icon: '📅' },
        { title: 'Menu Items', value: realStats.totalMenuItems.toLocaleString(), icon: '🍽️' },
        { title: 'Total Orders', value: realStats.totalOrders.toLocaleString(), icon: '🛒' }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set fallback values
      setStats([
        { title: 'Total Users', value: registeredUsers.length.toLocaleString(), icon: '👥' },
        { title: 'Reservations', value: reservations.length.toLocaleString(), icon: '📅' },
        { title: 'Menu Items', value: menuItems.length.toLocaleString(), icon: '🍽️' },
        { title: 'Total Orders', value: '0', icon: '🛒' }
      ]);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Menu Management Functions
  const handleAddItem = () => {
    setShowAddItemForm(true);
    setEditingItem(null);
    setNewItem({
      name: '',
      category: 'starters',
      price: '',
      description: '',
      image: '',
      isVeg: true
    });
  };

  const handleSaveItem = async () => {
    try {
      const formData = new FormData();
      
      // Add menu item data as JSON
      const itemData = editingItem 
        ? { ...newItem, id: editingItem._id || editingItem.id }
        : { ...newItem, id: Date.now() };
      
      formData.append('data', JSON.stringify(itemData));
      
      // Add image file if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      const url = editingItem 
        ? `${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/admin/menu/${editingItem._id || editingItem.id}`
        : `${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/admin/menu`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData // Don't set Content-Type header, let browser set it with boundary
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (editingItem) {
          // Update existing item
          setMenuItems(menuItems.map(item => 
            (item._id || item.id) === (editingItem._id || editingItem.id) ? result.menuItem : item
          ));
        } else {
          // Add new item
          setMenuItems([...menuItems, result.menuItem]);
        }
        
        await fetchMenuItems(); // Refresh menu items
      } else {
        const errorData = await response.json();
        alert(`Failed to save menu item: ${errorData.message || 'Unknown error'}`);
      }
      
      setShowAddItemForm(false);
      setEditingItem(null);
      setSelectedImage(null);
      setNewItem({ name: '', category: 'main-course', price: '', description: '', image: '', isVeg: true });
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item');
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      isVeg: item.isVeg
    });
    setImagePreview(getImageUrl(item.image));
    setShowAddItemForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPEG, JPG, PNG, GIF, and WebP images are allowed');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setNewItem({ ...newItem, image: '' });
  };

  const handleDeleteItem = async (itemId: string | number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/admin/menu/${itemId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Update local state to remove the deleted item
          setMenuItems(prevMenuItems => 
            prevMenuItems.filter(item => (item._id || item.id) !== itemId)
          );
          alert('Menu item deleted successfully');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete item: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Error deleting menu item');
      }
    }
  };

  // Reservation Management Functions
  const handleUpdateReservationStatus = async (reservationId: string | number, newStatus: string) => {
    console.log('Updating reservation:', { reservationId, newStatus });
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update response:', result);
        
        // Update local state immediately
        setReservations(prevReservations => 
          prevReservations.map(reservation => 
            reservation._id === reservationId 
              ? { ...reservation, status: newStatus }
              : reservation
          )
        );
        
        // Refresh data from server after a short delay to ensure consistency
        setTimeout(() => {
          fetchReservations();
        }, 1000); // Wait 1 second before refreshing
        
        alert(`Reservation status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        alert(`Failed to update reservation: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
      alert('Error updating reservation status');
    }
  };

  const handleEditReservation = (reservation: any) => {
    // For now, just show an alert - in real implementation, open edit form
    alert(`Edit reservation for ${reservation.name}`);
  };

  const handleDeleteReservation = async (reservationId: string | number) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/reservations/${reservationId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Refresh reservations from server to get updated data
          fetchReservations();
          alert('Reservation deleted successfully');
        } else {
          alert('Failed to delete reservation');
        }
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Error deleting reservation');
      }
    }
  };

  const handleLogout = () => {
    // Clear any admin session data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Redirect to login page
    history.push('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="tab-content">
            <h2>Order Management</h2>
            <p>Manage customer orders and update their status</p>
            <div className="order-management-link">
              <button 
                onClick={() => window.location.href = '/admin-orders'}
                className="full-manage-btn"
              >
                🍽️ Go to Full Order Management Dashboard
              </button>
            </div>
            <div className="quick-stats">
              <div className="stat-card">
                <h3>📊 Quick Order Stats</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">{orders.filter(o => o.status === 'pending').length}</span>
                    <span className="stat-label">Pending</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{orders.filter(o => o.status === 'preparing').length}</span>
                    <span className="stat-label">Preparing</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{orders.filter(o => o.status === 'ready').length}</span>
                    <span className="stat-label">Ready</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{orders.filter(o => o.status === 'completed').length}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="tab-content">
            <h2>Menu Management</h2>
            <p>Manage menu items, prices, and availability</p>
            <div className="menu-management">
              <button className="add-item-btn" onClick={handleAddItem}>+ Add New Item</button>
              
              {showAddItemForm && (
                <div className="add-item-form">
                  <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                  <div className="form-group">
                    <label>Item Name</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="Enter item name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    >
                      <option value="starters">Starters</option>
                      <option value="main-course">Main Course</option>
                      <option value="desserts">Desserts</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Menu Image</label>
                    <div className="image-upload-container">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="image-upload-btn">
                        📷 Choose Image
                      </label>
                      {imagePreview && (
                        <div className="image-preview-container">
                          <img src={imagePreview} alt="Preview" className="image-preview" />
                          <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                            ❌ Remove
                          </button>
                        </div>
                      )}
                      <small className="image-upload-info">
                        Supported formats: JPEG, JPG, PNG, GIF, WebP (Max 5MB)
                      </small>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newItem.isVeg}
                        onChange={(e) => setNewItem({...newItem, isVeg: e.target.checked})}
                      />
                      Vegetarian
                    </label>
                  </div>
                  <div className="form-actions">
                    <button className="save-btn" onClick={handleSaveItem}>
                      {editingItem ? 'Update' : 'Save'}
                    </button>
                    <button className="cancel-btn" onClick={() => setShowAddItemForm(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="menu-items-grid">
                {menuItems.length === 0 ? (
                  <div className="no-menu-items">
                    <h3>No menu items found</h3>
                    <p>Add your first menu item to get started</p>
                  </div>
                ) : (
                  menuItems.map((item, index) => (
                    <div key={item._id || index} className="menu-item-admin">
                      <div className="item-image-admin">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name}
                          onError={handleImageError}
                        />
                        <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'}>
                          {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </span>
                      </div>
                      <div className="item-details-admin">
                        <h3>{item.name}</h3>
                        <p className="category">{item.category}</p>
                        <p className="price">₹{item.price}</p>
                        <p className="description">{item.description}</p>
                      </div>
                      <div className="item-actions">
                        <button className="edit-btn" onClick={() => handleEditItem(item)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteItem(item._id || index)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      case 'reservations':
        return (
          <div className="tab-content">
            <div className="reservations-header">
              <h2>Reservation Management</h2>
              <div className="header-actions">
                <button 
                  className="refresh-btn" 
                  onClick={() => {
                    console.log('🔄 Force refreshing reservations...');
                    fetchReservations();
                  }}
                  disabled={loading}
                >
                  🔄 Force Refresh
                </button>
                <span className="last-updated">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
            <p>Manage table reservations and bookings</p>
            <div className="reservations-management">
              <div className="reservation-filters">
                <select className="filter-select">
                  <option value="all">All Reservations</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input type="date" className="date-filter" />
              </div>
              <div className="reservations-list">
                {reservations.length === 0 ? (
                  <p className="no-reservations">No reservations yet</p>
                ) : (
                  reservations.map((reservation, index) => (
                    <div key={index} className="reservation-item">
                      <div className="reservation-info">
                        <h3>{reservation.name}</h3>
                        <p>📧 {reservation.email}</p>
                        <p>📞 {reservation.phone}</p>
                        <p>📅 {reservation.date} at {reservation.time}</p>
                        <p>👥 {reservation.guests} guests</p>
                        <p>📝 {reservation.specialRequests || 'No special requests'}</p>
                      </div>
                      <div className="reservation-actions">
                        <select 
                          className={`status-btn ${reservation.status}`}
                          onChange={(e) => handleUpdateReservationStatus(reservation._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          className="edit-reservation-btn" 
                          onClick={() => handleEditReservation(reservation)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-reservation-btn" 
                          onClick={() => handleDeleteReservation(reservation._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="tab-content">
            <h2>User Management</h2>
            <p>Real-time user registrations and accounts</p>
            <div className="users-list">
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <>
                  {registeredUsers.length === 0 ? (
                    <div className="no-users-state">
                      <div className="no-users-icon">👥</div>
                      <h3>No Users Yet</h3>
                      <p>When users register on your website, they will appear here</p>
                      <div className="user-stats">
                        <span>Total Registered: {registeredUsers.length}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="users-grid">
                      {registeredUsers.map((user) => (
                        <div key={user._id} className="user-card">
                          <div className="user-avatar">
                            <div className="avatar-circle">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="user-details">
                            <h3>{user.name}</h3>
                            <p className="user-email">📧 {user.email}</p>
                            <p className="user-date">📅 Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                            <p className="user-role">🔑 Role: {user.role || 'user'}</p>
                          </div>
                          <div className="user-actions">
                            <button className="view-user-btn" onClick={() => handleViewUser(user)}>
                              View Details
                            </button>
                            <button className="delete-user-btn" onClick={() => handleDeleteUser(user._id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="user-summary">
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-number">{registeredUsers.length}</span>
                  <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{registeredUsers.filter(u => u.role === 'admin').length}</span>
                  <span className="stat-label">Admins</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{registeredUsers.filter(u => u.role === 'user').length}</span>
                  <span className="stat-label">Customers</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {authChecking ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="loading-spinner"></div>
          <div>Checking authentication...</div>
        </div>
      ) : (
        <>
          <header className="admin-header">
            <div className="header-content">
              <div className="logo-section">
                <div className="logo">Dine n Delight</div>
                <div className="admin-badge">Admin Panel</div>
              </div>
              <div className="header-actions">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="admin-main">
            <div className="welcome-section">
              <div className="welcome-content">
                <div className="welcome-text">
                  <h1>Welcome back, Admin.</h1>
                  <p>Here's what's happening at Dine n Delight.</p>
                </div>
                <button className="refresh-btn" onClick={refreshData} disabled={loading}>
                  <span className="refresh-icon">🔄</span>
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>

            <div className="stats-grid">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="loading-spinner"></div>
                  <p>Loading dashboard data...</p>
                </div>
              ) : (
                stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-info">
                      <h3>{stat.title}</h3>
                      <p>{stat.value}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="management-section">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  Order Management
                </button>
                <button
                  className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
                  onClick={() => setActiveTab('menu')}
                >
                  Menu Management
                </button>
                <button
                  className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reservations')}
                >
                  Reservations
                </button>
                <button
                  className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </button>
              </div>

              <div className="tab-content">
                {renderTabContent()}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default () => (
  <ErrorBoundary>
    <AdminDashboard />
  </ErrorBoundary>
);
