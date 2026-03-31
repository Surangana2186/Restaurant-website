import React, { useState, useEffect } from 'react';
import './Menu.css';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

interface MenuItem {
  _id?: string;
  id?: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  isVeg: boolean;
  description: string;
  image: string;
  chefSpecial?: boolean;
  spicy?: boolean;
  glutenFree?: boolean;
  available?: boolean;
}

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/menu');
      const data = await response.json();
      
      if (data.success && data.menuItems) {
        setMenuItems(data.menuItems);
      } else {
        console.error('Failed to fetch menu items:', data.message);
        // Fallback to sample data if API fails
        const sampleMenuItems: MenuItem[] = [
          // Starters
          {
            id: 1,
            name: "Paneer Tikka",
            category: "starters",
            price: 299,
            rating: 4.8,
            isVeg: true,
            description: "Soft cottage cheese cubes marinated in yogurt and spices, grilled in tandoor",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
            chefSpecial: true,
            glutenFree: true
          },
          {
            id: 2,
            name: "Chicken Seekh Kebab",
            category: "starters",
            price: 349,
            rating: 4.9,
            isVeg: false,
            description: "Minced chicken skewers with aromatic spices, grilled to perfection",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
            chefSpecial: true,
            spicy: true
          },
          // Main Course
          {
            id: 3,
            name: "Butter Chicken",
            category: "main-course",
            price: 449,
            rating: 4.7,
            isVeg: false,
            description: "Tender chicken in rich, creamy tomato-based curry with butter",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
            chefSpecial: true,
            spicy: true
          },
          {
            id: 4,
            name: "Palak Paneer",
            category: "main-course",
            price: 399,
            rating: 4.6,
            isVeg: true,
            description: "Cottage cheese cubes in creamy spinach gravy with aromatic spices",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
            glutenFree: true
          },
          // Desserts
          {
            id: 5,
            name: "Gulab Jamun",
            category: "desserts",
            price: 199,
            rating: 4.8,
            isVeg: true,
            description: "Soft milk dumplings soaked in rose-flavored sugar syrup",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
            chefSpecial: true
          },
          {
            id: 6,
            name: "Rasmalai",
            category: "desserts",
            price: 249,
            rating: 4.7,
            isVeg: true,
            description: "Soft cottage cheese patties in sweet, creamy milk sauce",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
            glutenFree: true
          },
          // Beverages
          {
            id: 7,
            name: "Mango Lassi",
            category: "beverages",
            price: 149,
            rating: 4.9,
            isVeg: true,
            description: "Sweet and creamy yogurt drink with mango pulp",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
            glutenFree: true
          },
          {
            id: 8,
            name: "Masala Chai",
            category: "beverages",
            price: 99,
            rating: 4.6,
            isVeg: true,
            description: "Spiced Indian tea with milk and aromatic spices",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
            glutenFree: true
          }
        ];
        setMenuItems(sampleMenuItems);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const addToCart = (item: MenuItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((cartItem: MenuItem) => 
      (cartItem._id && cartItem._id === item._id) || (cartItem.id && cartItem.id === item.id)
    );
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'cart-success-message';
    message.textContent = `${item.name} added to cart!`;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-spinner"></div>
        <p>Loading delicious menu items...</p>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <div className="hero-content">
          <h1>🍽️ Our Menu</h1>
          <p>Discover our delicious selection of authentic dishes</p>
        </div>
      </div>

      <div className="menu-container">
        <div className="menu-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-options">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <div className="menu-grid">
          {filteredAndSortedItems.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No dishes found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredAndSortedItems.map((item) => (
              <div key={item._id || item.id} className="menu-item-card">
                <div className="menu-item-image">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name}
                    onError={handleImageError}
                  />
                  <div className="item-badges">
                    {item.isVeg && <span className="veg-badge">🟢 Veg</span>}
                    {!item.isVeg && <span className="non-veg-badge">🔴 Non-Veg</span>}
                    {item.chefSpecial && <span className="chef-special">👨‍🍳 Chef's Special</span>}
                    {item.spicy && <span className="spicy-badge">🌶️ Spicy</span>}
                    {item.glutenFree && <span className="gluten-free-badge">🌾 Gluten-Free</span>}
                  </div>
                </div>
                
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-rating">
                      <span className="rating-stars">⭐ {item.rating}</span>
                    </div>
                  </div>
                  
                  <p className="item-category">{item.category}</p>
                  <p className="item-description">{item.description}</p>
                  
                  <div className="menu-item-footer">
                    <div className="item-price">₹{item.price}</div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                    >
                      {item.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
