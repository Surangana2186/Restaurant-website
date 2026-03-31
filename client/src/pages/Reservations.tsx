import React, { useState } from 'react';
import './Reservations.css';

const Reservations = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting reservation:', formData);
    
    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        console.log('Reservation submitted:', result);
        setSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            guests: '2',
            specialRequests: ''
          });
        }, 3000);
      } else {
        console.error('Error submitting reservation:', result);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  return (
    <div className="reservations reservation-bg-1">
      <div className="reservations-container">
        <div className="reservations-header">
          <div className="header-icon">🍽️</div>
          <h1>Reserve Your Table</h1>
          <p>Book an unforgettable dining experience at Dine n Delight</p>
          <div className="header-features">
            <div className="feature">
              <span className="feature-icon">⏰</span>
              <span>Quick Confirmation</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🍽️</span>
              <span>Best Tables</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎉</span>
              <span>Special Events</span>
            </div>
          </div>
        </div>

        <div className="reservations-content">
          <div className="reservation-form">
            <div className="form-header">
              <h2>Reservation Details</h2>
              <p>Fill in your information to book your table</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      <span className="label-icon">👤</span>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">
                      <span className="label-icon">📧</span>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">
                    <span className="label-icon">📱</span>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Reservation Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">
                      <span className="label-icon">📅</span>
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">
                      <span className="label-icon">⏰</span>
                      Preferred Time *
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="guests">
                    <span className="label-icon">👥</span>
                    Number of Guests *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="7">7 Guests</option>
                    <option value="8">8 Guests</option>
                    <option value="9">9 Guests</option>
                    <option value="10">10 Guests</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>Special Requests</h3>
                <div className="form-group">
                  <label htmlFor="specialRequests">
                    <span className="label-icon">💬</span>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Any dietary restrictions, special occasions, or preferences?"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  <span className="btn-icon">🍽️</span>
                  {submitted ? 'Reservation Confirmed!' : 'Reserve Your Table'}
                </button>
                <button type="button" className="reset-btn" onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    guests: '2',
                    specialRequests: ''
                  });
                }}>
                  <span className="btn-icon">🔄</span>
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          <div className="reservation-info">
            <div className="info-section">
              <h2>Reservation Information</h2>
              <div className="info-grid">
                <div className="info-card">
                  <h3>Hours of Operation</h3>
                  <div className="hours-list">
                    <div className="hours-item">
                      <span className="day">Monday - Sunday</span>
                      <span className="time">11:00 AM - 9:30 PM</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Contact Information</h3>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <div>
                      <strong>Address</strong><br />
                      101,Dine and Delight<br />
                      Vishnu Nagar,Thane-400601
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <div>
                      <strong>Phone</strong><br />
                      9076428617<br />
                      <small>Available during business hours</small>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <div>
                      <strong>Email</strong><br />
                      dineanddelight13@.com<br />
                      <small>We respond within 24 hours</small>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">💬</span>
                    <div>
                      <strong>Live Chat</strong><br />
                      Available on our website<br />
                      <small>Mon-Fri: 9 AM - 6 PM</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-card">
                <h3>Reservation Policy</h3>
                <ul className="policy-list">
                  <li>Reservations are held for 15 minutes</li>
                  <li>Cancellations must be made 2 hours in advance</li>
                  <li>Large parties (6+) may require a deposit</li>
                  <li>Special dietary needs can be accommodated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
