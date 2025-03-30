import React from 'react';
import '../assets/Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "John Trucker",
      role: "Long Haul Driver",
      text: "ELDLogger has revolutionized how I manage my routes. The compliance features saved me hours of paperwork!",
      photo: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "Sarah Logistics",
      role: "Fleet Manager",
      text: "Best ELD solution we've used. Real-time tracking and reporting are game changers for our operations.",
      photo: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Mike Owner",
      role: "Trucking Company Owner",
      text: "The analytics dashboard helped us reduce fuel costs by 15% in the first month. Incredible value!",
      photo: "https://via.placeholder.com/150"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <img 
                  src={testimonial.photo} 
                  alt={testimonial.name} 
                  className="user-photo"
                />
                <div className="user-info">
                  <h3>{testimonial.name}</h3>
                  <p>{testimonial.role}</p>
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;