import React, { useState } from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  console.log('Contact component mounted');
  console.log('Current form data:', formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Form field changed:', { name, value });
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    
    // Clear any previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setSubmitted(true);
    
    try {
      console.log('Attempting to send request to:', `${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/contact`);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://restaurant-website-jy83.onrender.com/api'}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        setSuccessMessage(data.message);
        setTimeout(() => {
          setSubmitted(false);
          setSuccessMessage('');
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
        }, 5000);
      } else {
        console.log('Response not ok, status:', response.status);
        const errorData = await response.json().catch(() => ({ message: 'Server error occurred' }));
        console.log('Error response:', errorData);
        setErrorMessage(errorData.message || 'Failed to send message. Please try again.');
        setSubmitted(false);
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Network error details:', error);
      if (error instanceof Error) {
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error type:', typeof error);
        console.error('Error details:', error);
      }
      setErrorMessage('Network error. Please check your connection and try again.');
      setSubmitted(false);
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  const subjects = [
    'General Inquiry',
    'Reservation Question',
    'Feedback',
    'Complaint',
    'Partnership Opportunity',
    'Other'
  ];

  return (
    <div className="contact contact-bg-1">
      <div className="contact-container">
        {/* Grid Layout for Form and Info */}
        <div className="contact-content">
          {/* Left Side - Contact Form */}
          <div className="contact-form-left">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you soon</p>
            </div>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-section">
                <h3>Your Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <span className="label-icon">👤</span>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
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
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">
                      <span className="label-icon">📱</span>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">
                      <span className="label-icon">📋</span>
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Your Message</h3>
                <div className="form-group">
                  <label htmlFor="message">
                    <span className="label-icon">💬</span>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={submitted}>
                  <span className="btn-icon">📤</span>
                  {submitted ? 'Sending...' : 'Send Message'}
                </button>
                <button type="button" className="reset-btn" onClick={() => {
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                  });
                  setSuccessMessage('');
                  setErrorMessage('');
                }}>
                  <span className="btn-icon">🔄</span>
                  Clear Form
                </button>
              </div>

              {successMessage && (
                <div className="success-message">
                  <span className="message-icon">✅</span>
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="error-message">
                  <span className="message-icon">❌</span>
                  {errorMessage}
                </div>
              )}
            </form>
          </div>

          {/* Right Side - Contact Information */}
          <div className="contact-info-right">
            <div className="info-card">
              <h3>Visit Our Restaurant</h3>
              <div className="location-info">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <strong>Address</strong><br />
                    101,Dine and Delight<br />
                    Vishnu Nagar,Thane-400601
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕐</span>
                  <div>
                    <strong>Hours</strong><br />
                    Mon-Thu: 11:00 AM - 10:00 PM<br />
                    Fri-Sat: 11:00 AM - 11:00 PM<br />
                    Sunday: 12:00 PM - 9:00 PM
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Contact Information</h3>
              <div className="contact-methods">
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

          {/* FAQ Section */}
          <div className="faq-section">
            <div className="faq-header">
              <h2>Frequently Asked Questions</h2>
              <p>Find answers to common questions about our restaurant</p>
            </div>
            <div className="faq-list">
              <div className="faq-item">
                <h4>Do I need a reservation?</h4>
                <p>Reservations are recommended, especially for weekends and large groups.</p>
              </div>
              <div className="faq-item">
                <h4>Do you accommodate dietary restrictions?</h4>
                <p>Yes! Please let us know about any dietary needs when making a reservation.</p>
              </div>
              <div className="faq-item">
                <h4>Is parking available?</h4>
                <p>We offer valet parking and have nearby street parking available.</p>
              </div>
              <div className="faq-item">
                <h4>Do you have a dress code?</h4>
                <p>Smart casual is recommended. No athletic wear or flip-flops please.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
