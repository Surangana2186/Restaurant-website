import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AdminAccess: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    // Redirect to admin login page
    history.push('/login?admin=true');
  }, [history]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirecting to Admin Login...</h2>
        <p>Please wait...</p>
      </div>
    </div>
  );
};

export default AdminAccess;
