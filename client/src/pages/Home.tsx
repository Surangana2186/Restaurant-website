import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import Reservations from './Reservations';
import About from './About';
import Contact from './Contact';
import './Home.css';
import '../styles/backgrounds.css';

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  
  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'menu', name: 'Menu' },
    { id: 'reservations', name: 'Reservations' },
    { id: 'about', name: 'About' },
    { id: 'contact', name: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate which section is in view based on actual element positions
      let currentSection = 0;
      
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const elementBottom = elementTop + rect.height;
          
          // Check if this section is in view
          if (scrollPosition + windowHeight / 2 >= elementTop && 
              scrollPosition + windowHeight / 2 <= elementBottom) {
            currentSection = index;
          }
        }
      });
      
      setActiveSection(currentSection);
      
      // Update header active states
      updateHeaderActiveStates(currentSection);
    };

    const updateHeaderActiveStates = (sectionIndex: number) => {
      const navButtons = document.querySelectorAll('.header .nav .nav-button');
      navButtons.forEach((button, index) => {
        if (index === sectionIndex) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Set initial active state
    setTimeout(() => {
      updateHeaderActiveStates(0); // Home section is active initially
    }, 100);
    
    // Handle hash scroll on page load
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const sectionElement = document.getElementById(sections[index].id);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="hero" className="hero hero-bg-13">
        <div className="hero-content">
          <div className="hero-rating">
            <span>★★★★★</span>
          </div>
          <h1 className="hero-title">Dine n Delight</h1>
          <p className="hero-description">
            Experience culinary excellence in our elegant restaurant atmosphere. 
            Where every meal is a celebration of flavor, tradition, and exceptional service.
          </p>
          <div className="hero-actions">
            <button 
              onClick={() => scrollToSection(1)} 
              className="btn-primary"
            >
              Explore Our Menu →
            </button>
            <button 
              onClick={() => scrollToSection(2)} 
              className="btn-secondary"
            >
              Make a Reservation
            </button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu-section menu-bg-2">
        <Menu />
      </section>

      {/* Reservations Section */}
      <section id="reservations" className="reservations-section reservation-bg-1">
        <div className="section-header">
          <h2>Make a Reservation</h2>
          <p>Book your table for an unforgettable dining experience</p>
        </div>
        <Reservations />
      </section>

      {/* About Section */}
      <section id="about" className="about-section about-bg-2">
        <div className="section-header">
          <h2>About Us</h2>
          <p>Our story and passion for culinary excellence</p>
        </div>
        <About />
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section contact-bg-1">
        <div className="section-header">
          <h2>Contact Us</h2>
          <p>Get in touch with us</p>
        </div>
        <Contact />
      </section>

      {/* Navigation Dots */}
      <div className="page-indicator">
        <div className="nav-dots">
          {sections.map((section, index) => (
            <button
              key={section.id}
              className={`dot ${activeSection === index ? 'active' : ''}`}
              onClick={() => scrollToSection(index)}
              title={section.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
