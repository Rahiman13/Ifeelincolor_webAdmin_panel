import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <span className="footer-text">
          &copy; {new Date().getFullYear()} <a href="#" target="_blank" rel="noopener noreferrer" className="footer-link">ifeelin_color.com</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;