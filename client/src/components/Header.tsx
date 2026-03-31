import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import QRScanner from './QRScanner';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check if we're on the home page
    setIsHomePage(location.pathname === '/');
    
    // Check user session
    const email = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const adminEmail = localStorage.getItem('adminEmail');
    const adminToken = localStorage.getItem('adminToken');
    
    setUserEmail(email);
    setIsAdmin(!!(adminEmail && adminToken));

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        const count = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      }
    };

    updateCartCount();
    
    // Listen for cart changes
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home page, navigate to home and then scroll
      window.location.href = `/#${sectionId}`;
    }
  };

  const updateActiveButton = (sectionId: string) => {
    if (isHomePage) {
      const navButtons = document.querySelectorAll('.header .nav button');
      navButtons.forEach((button) => {
        button.classList.remove('active');
      });
      
      const activeButton = document.querySelector(`.header .nav button[onclick*="${sectionId}"]`);
      if (activeButton) {
        activeButton.classList.add('active');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userToken');
    setUserEmail(null);
    setIsAdmin(false);
    setShowUserMenu(false);
    
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <div className="logo-circle">D</div>
          <span className="logo-text">Dine n Delight</span>
        </div>
        
        <nav className="nav">
          {isHomePage ? (
            <>
              <button 
                onClick={() => scrollToSection('hero')} 
                className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}
                data-section="hero"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('menu')} 
                className={`nav-button ${location.pathname === '/menu' ? 'active' : ''}`}
                data-section="menu"
              >
                Menu
              </button>
              <button 
                onClick={() => scrollToSection('reservations')} 
                className={`nav-button ${location.pathname === '/reservations' ? 'active' : ''}`}
                data-section="reservations"
              >
                Reservations
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className={`nav-button ${location.pathname === '/about' ? 'active' : ''}`}
                data-section="about"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className={`nav-button ${location.pathname === '/contact' ? 'active' : ''}`}
                data-section="contact"
              >
                Contact
              </button>
              {isAdmin && (
                <button 
                  onClick={() => window.location.href = '/admin'} 
                  className="nav-button admin-nav-btn"
                  style={{background: '#dc2626', color: 'white'}}
                >
                  🎛 Admin Dashboard
                </button>
              )}
              {userEmail && !isAdmin && (
                <button 
                  onClick={() => window.location.href = '/orders'} 
                  className="nav-button orders-nav-btn"
                  style={{background: '#27ae60', color: 'white'}}
                >
                  📋 My Orders
                </button>
              )}
            </>
          ) : (
            <>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
              <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>Menu</Link>
              <Link to="/reservations" className={location.pathname === '/reservations' ? 'active' : ''}>Reservations</Link>
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="admin-nav-btn"
                  style={{background: '#dc2626', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px'}}
                >
                  🎛 Admin Dashboard
                </Link>
              )}
              {userEmail && !isAdmin && (
                <Link 
                  to="/orders" 
                  className="orders-nav-btn"
                  style={{background: '#27ae60', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px'}}
                >
                  📋 My Orders
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="header-actions">
          {!isAdmin && (
            <Link to="/cart" className="cart-icon">
              🛒
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          )}
          
          {userEmail ? (
            <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
              <span>{userEmail}</span>
              <span className="dropdown-arrow">▼</span>
              {showUserMenu && (
                <div className="user-dropdown">
                  <button onClick={handleLogout} className="logout-dropdown-btn">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              {location.pathname !== '/login' && (
                <Link to="/login" className="login-btn">Login</Link>
              )}
              {location.pathname !== '/signup' && (
                <Link to="/signup" className="signup-btn">Sign Up</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
