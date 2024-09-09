import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className="main-content">
        {/* Your page content goes here */}
        <footer className="footer">
          <div className="footer-container">
            <span className="footer-text">
              &copy; {new Date().getFullYear()} <a href="#" target="_blank" rel="noopener noreferrer" className="footer-link">ifeelin_color.com</a>
            </span>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
