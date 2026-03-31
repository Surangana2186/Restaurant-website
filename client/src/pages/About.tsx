import React from 'react';
import './About.css';

const About: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      review: "Absolutely fantastic dining experience! The butter chicken was authentic and flavorful. The ambiance is perfect for family dinners. Will definitely visit again!",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Rahul Verma",
      rating: 5,
      review: "Best Indian restaurant in town! The naan is freshly made and the dal makhani is to die for. Excellent service and reasonable prices. Highly recommend!",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Anjali Patel",
      rating: 4,
      review: "Great food and wonderful atmosphere. The paneer tikka was delicious. Only suggestion would be to increase portion sizes slightly. Overall, a wonderful experience!",
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "Vikram Singh",
      rating: 5,
      review: "Outstanding quality and taste! The biryani is authentic and reminds me of home. The staff is very attentive and the restaurant is always clean. A must-visit!",
      date: "2 months ago"
    },
    {
      id: 5,
      name: "Kavita Reddy",
      rating: 5,
      review: "Perfect place for celebrations! We celebrated our anniversary here and the staff made it special. The thali was amazing with so many varieties. Thank you Dine & Delight!",
      date: "1 week ago"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
        {i < rating ? '⭐' : '☆'}
      </span>
    ));
  };

  return (
    <div className="about-page about-bg-4">
      <div className="about-container">
        <h1 className="about-title">Our Mission</h1>
        <p className="about-mission">
          At Dine n Delight, we believe that dining is not just about food—it's about creating 
          moments of joy, connection, and discovery. Our mission is to provide an exceptional 
          culinary experience that celebrates the finest ingredients, innovative techniques, 
          and the timeless art of hospitality.
        </p>
        
        <div className="about-cards">
          <div className="about-card">
            <h3>Culinary Excellence</h3>
            <p>
              We source the finest ingredients from local farms and trusted suppliers around the world. 
              Our chefs blend traditional techniques with modern innovation to create dishes that 
              delight the senses and honor culinary traditions.
            </p>
          </div>
          
          <div className="about-card">
            <h3>Warm Hospitality</h3>
            <p>
              Our dedicated team is committed to creating memorable experiences for every guest. 
              From the moment you walk through our doors, we strive to make you feel welcomed, 
              valued, and cared for throughout your dining journey.
            </p>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="reviews-section">
          <h2 className="reviews-title">What Our Customers Say</h2>
          <div className="reviews-carousel">
            <div className="reviews-track">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <h4 className="reviewer-name">{review.name}</h4>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-text">{review.review}</p>
                  <p className="review-date">{review.date}</p>
                </div>
              ))}
              {/* Duplicate reviews for seamless loop */}
              {reviews.map((review) => (
                <div key={`duplicate-${review.id}`} className="review-card">
                  <div className="review-header">
                    <h4 className="reviewer-name">{review.name}</h4>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-text">{review.review}</p>
                  <p className="review-date">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
