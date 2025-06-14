
import React from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';

const Home = () => {

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-left">
        <h1>
          Donate Better. Receive Safer. <br />
          Together We Care.
        </h1>
        <p className="description-text">
  The <span className="highlight">Medicine Donation System</span> is a community-driven initiative to <span className="highlight">collect and redistribute unused medicines</span>. Through this platform, individuals can contribute their <span className="highlight">surplus medicines</span> to <span className="highlight">NGOs and needy individuals</span>. Join our mission to <span className="highlight">improve healthcare accessibility</span> and <span className="highlight">reduce medical waste</span>.
  <br /><br />
  Our platform ensures <span className="highlight">secure and transparent handling of donations</span>. We work closely with <span className="highlight">verified NGOs</span> to distribute medicines where they are most needed. Make a difference today by <span className="highlight">donating</span> or <span className="highlight">applying for required medicines</span>.
</p>

        <div className="button-row">
          <a href="/donate" className="donate-button">Donate Medicines</a>
          <a href="/apply" className="apply-button">Request Medicines</a>
        </div>
      </div>

      {/* 📞 Help Section */}
      <footer className="home-footer">
        <p>
          📧 <a href="mailto:asimbage0786@gmail.com">support@gmail.com</a> | 
          📞 <a href="tel:+919686117020">+91 9686117020</a> | 
          🔗 <a href="https://www.linkedin.com/in/mohammedasim-bage-4290b22a9" target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
          📸 <a href="https://www.instagram.com/mdasimb_18" target="_blank" rel="noopener noreferrer">Instagram</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
