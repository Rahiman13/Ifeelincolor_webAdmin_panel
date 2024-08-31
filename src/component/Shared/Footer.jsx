import React, { Component } from 'react';
import './Footer.css'; // Ensure you have the CSS styles in this file

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-container">
          <span className="footer-text">
            &copy; {new Date().getFullYear()} <a href="#" target="_blank" rel="noopener noreferrer" className="footer-link">ifeelin_color.com</a>
          </span>
          {/* Uncomment and update the link if you want to add a credit line */}
          {/* <span className="footer-credit">
            Free <a href="https://www.bootstrapdash.com/react-admin-templates/" target="_blank" rel="noopener noreferrer" className="footer-link">react admin templates</a> from BootstrapDash.com.
          </span> */}
        </div>
      </footer>
    );
  }
}

export default Footer;
