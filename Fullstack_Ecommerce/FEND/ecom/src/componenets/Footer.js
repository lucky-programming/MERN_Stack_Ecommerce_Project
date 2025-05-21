import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-4 mt-auto animated-footer">
      <div className="container text-center">
        <h4 className="mb-3">© 2025 <span className="text-warning">Lucky Collections</span> — All Rights Reserved 🎉</h4>
        <div className="footer-links d-flex justify-content-center flex-wrap gap-3">
          <Link to="/about" className="flink text-decoration-none">📖 About</Link>
          <Link to="/policy" className="flink text-decoration-none">🔐 Privacy Policy</Link>
          <Link to="/contact" className="flink text-decoration-none">📞 Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
