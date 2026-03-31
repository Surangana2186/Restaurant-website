import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AdminTest = () => {
  const history = useHistory();

  useEffect(() => {
    // Check localStorage
    const adminEmail = localStorage.getItem('adminEmail');
    const adminToken = localStorage.getItem('adminToken');
    const userEmail = localStorage.getItem('userEmail');
    const userToken = localStorage.getItem('userToken');
    
    console.log('AdminTest - All localStorage data:', {
      adminEmail,
      adminToken,
      userEmail,
      userToken
    });

    // Check all items in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key || '');
      console.log(`LocalStorage[${i}]:`, { key, value });
    }
  }, []);

  const handleAdminLogin = () => {
    localStorage.setItem('adminEmail', 'admin@123.com');
    localStorage.setItem('adminToken', 'test-admin-token');
    console.log('Manual admin login completed');
    history.push('/admin');
  };

  const handleClearStorage = () => {
    localStorage.clear();
    console.log('LocalStorage cleared');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Authentication Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Debug Information:</h3>
        <p>Check browser console (F12) for localStorage data</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleAdminLogin} style={{ 
          background: '#dc2626', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer'
        }}>
          Set Admin Login & Go to Dashboard
        </button>
        
        <button onClick={handleClearStorage} style={{ 
          background: '#6b7280', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Clear All Storage
        </button>
      </div>

      <div>
        <h3>Manual Steps:</h3>
        <ol>
          <li>Open browser console (F12)</li>
          <li>Click "Set Admin Login & Go to Dashboard"</li>
          <li>Check console logs for authentication status</li>
          <li>If redirected, check what localStorage contains</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminTest;
