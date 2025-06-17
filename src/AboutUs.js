import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar1 from './Navbar1';
import './Navbar.css'; // Using the same CSS file
import './AboutUs.css'; // Additional styles for About Us

const AboutUs = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-us-page">
        <Navbar1/>
      {/* Simple Navbar for About Us */}
      <nav className={`navbar about-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">G</div>
            <span>Guest Panel</span>
          </Link>
          
          <div className="about-nav-links">
            <Link to="/" className="nav-link">Back to Home</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">About MediCare</h1>
            <p className="hero-subtitle">
              Bridging the gap between medicine donors and those in need through technology and compassion
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="section-divider"></div>
          </div>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M19 14C19 18.4183 15.4183 22 11 22C6.58172 22 3 18.4183 3 14C3 9.58172 6.58172 6 11 6C15.4183 6 19 9.58172 19 14Z" stroke="#667eea" strokeWidth="2"/>
                  <path d="M9 11L11 13L15 9" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Reduce Medicine Waste</h3>
              <p>We help prevent unused medicines from going to waste by connecting donors with those who need them most.</p>
            </div>
            
            <div className="mission-card">
              <div className="mission-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="#667eea" strokeWidth="2"/>
                  <path d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15C17.9391 15 16.9217 15.4214 16.1716 16.1716C15.4214 16.9217 15 17.9391 15 19V21" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Support Communities</h3>
              <p>Our platform enables communities to support each other by sharing essential medications with those in need.</p>
            </div>
            
            <div className="mission-card">
              <div className="mission-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Improve Healthcare Access</h3>
              <p>We work to make healthcare more accessible by ensuring medications reach people who cannot afford them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="about-section how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <div className="section-divider"></div>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Donate Medicines</h3>
              <p>Users can donate unused, unexpired medications through our secure platform</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Verify & Process</h3>
              <p>Our team verifies donations and ensures they meet safety and quality standards</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Match & Distribute</h3>
              <p>We match available medicines with verified requests from people in need</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Deliver Safely</h3>
              <p>Medications are delivered safely to recipients through our trusted network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section team-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Our Impact</h2>
            <div className="section-divider"></div>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Medicines Donated</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">People Helped</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">150+</div>
              <div className="stat-label">Partner Organizations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section values-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Our Values</h2>
            <div className="section-divider"></div>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <h3>Transparency</h3>
              <p>We maintain complete transparency in our donation and distribution process, ensuring donors and recipients know exactly how the system works.</p>
            </div>
            <div className="value-card">
              <h3>Safety First</h3>
              <p>Every medication goes through rigorous safety checks and verification processes before being distributed to ensure recipient safety.</p>
            </div>
            <div className="value-card">
              <h3>Accessibility</h3>
              <p>We believe healthcare should be accessible to everyone, regardless of their economic status or geographical location.</p>
            </div>
            <div className="value-card">
              <h3>Community</h3>
              <p>We foster a strong community spirit where people help each other and build lasting connections through acts of kindness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-section contact-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Get Involved</h2>
            <div className="section-divider"></div>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Join Our Mission</h3>
              <p>Whether you want to donate medicines, volunteer, or partner with us, there are many ways to get involved and make a difference in your community.</p>
              <div className="contact-buttons">
                <Link to="/Login" className="btn btn-primary">Start Donating</Link>
                <Link to="/Login" className="btn btn-secondary">Request Medicines</Link>
              </div>
            </div>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Email:</strong>
                <span>asimbage0786@gmail.com</span>
              </div>
              <div className="contact-item">
                <strong>Phone:</strong>
                <span>+91 9686117020</span>
              </div>
              <div className="contact-item">
                <strong>Address:</strong>
                <span>P B Dargah Chinchali Road, Kudachi 591311</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="professional-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>📧 <a href="mailto:asimbage0786@gmail.com">support@gmail.com</a></p>
            <p>📞 <a href="tel:+919686117020">+91 9686117020</a></p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <p>🔗 <a href="https://www.linkedin.com/in/mohammedasim-bage-4290b22a9" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
            <p>📸 <a href="https://www.instagram.com/mdasimb_18" target="_blank" rel="noopener noreferrer">Instagram</a></p>
          </div>
          <div className="footer-section">
            <h4>Medicine Distribution System</h4>
            <p>Connecting people with essential medicines through trusted NGO partners</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Medicine Distribution System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;