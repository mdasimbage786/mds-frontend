import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-content">
        <div className="home-left">
          <h1>
            Donate Better. Receive Safer. <br />
            <span className="highlight">Together We Care.</span>
          </h1>
          <p className="description-text">
            The <span className="highlight">Medicine Donation System</span> is a community-driven initiative to 
            <span className="highlight"> collect and redistribute unused medicines</span>. 
            Through this platform, individuals can contribute their <span className="highlight">surplus medicines</span> to 
            <span className="highlight"> NGOs and needy individuals</span>. Join our mission to 
            <span className="highlight"> improve healthcare accessibility</span> and 
            <span className="highlight"> reduce medical waste</span>.
          </p>

          <div className="button-row">
            <Link to="/donate" className="donate-button">
              💊 Donate Medicines
            </Link>
            <Link to="/apply" className="apply-button">
              🏥 Request Medicines
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Secure Donations</h3>
            <p>
              Our platform ensures secure and transparent handling of all medicine donations. 
              Every transaction is tracked and verified for maximum safety.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Verified NGOs</h3>
            <p>
              We work closely with verified NGOs and healthcare organizations to ensure 
              medicines reach those who need them most.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Community Impact</h3>
            <p>
              Join thousands of donors making a real difference in healthcare accessibility 
              while reducing medical waste in our communities.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>1000+</h3>
            <p>Medicines Donated</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Lives Helped</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Partner NGOs</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="mailto:asimbage0786@gmail.com">
              📧 support@gmail.com
            </a>
            <a href="tel:+919686117020">
              📞 +91 9686117020
            </a>
            <a 
              href="https://www.linkedin.com/in/mohammedasim-bage-4290b22a9" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              🔗 LinkedIn
            </a>
            <a 
              href="https://www.instagram.com/mdasimb_18" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              📸 Instagram
            </a>
          </div>
          <div className="footer-text">
            <p>&copy; 2024 Medicine Donation System. Making healthcare accessible for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;