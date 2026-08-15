import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Mail, Phone, MapPin, Globe, Compass, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '1.6rem', fontWeight: '700', marginBottom: '15px' }}>
              <Trees size={28} style={{ color: 'var(--gold-accent)' }} />
              <span style={{ fontFamily: '"Playfair Display", serif' }}>ForestStay</span>
            </Link>
            <p style={{ maxWidth: '380px', fontSize: '0.9rem', color: '#a3b8ad', marginBottom: '20px' }}>
              We curate the world\'s most breathtaking nature cabins, domes, and treehouses. Experience raw wilderness without sacrificing modern luxury.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: '#a3b8ad', transition: 'var(--transition-fast)' }} className="social-link"><Globe size={20} /></a>
              <a href="#" style={{ color: '#a3b8ad', transition: 'var(--transition-fast)' }} className="social-link"><Compass size={20} /></a>
              <a href="#" style={{ color: '#a3b8ad', transition: 'var(--transition-fast)' }} className="social-link"><Share2 size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Destinations</h3>
            <ul>
              <li><Link to="/cabins?location=Redwood">Redwood Forests</Link></li>
              <li><Link to="/cabins?location=Olympic">Olympic Peninsula</Link></li>
              <li><Link to="/cabins?location=Blue+Ridge">Blue Ridge Mountains</Link></li>
              <li><Link to="/cabins?location=Smoky">Smoky Mountains</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              <li><Link to="/cabins">All Cabins</Link></li>
              <li><a href="#">FAQ & Help Center</a></li>
              <li><a href="#">Booking Policies</a></li>
              <li><a href="#">Our Commitments</a></li>
            </ul>
          </div>

          <div className="footer-links" style={{ minWidth: '200px' }}>
            <h3>Contact Us</h3>
            <ul style={{ color: '#a3b8ad', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MapPin size={16} style={{ color: 'var(--gold-accent)' }} />
                <span>100 Canopy Rd, Bend OR</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Phone size={16} style={{ color: 'var(--gold-accent)' }} />
                <span>+1 (800) 555-STAY</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Mail size={16} style={{ color: 'var(--gold-accent)' }} />
                <span>hello@foreststay.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ForestStay Stays Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: '#a3b8ad' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#a3b8ad' }}>Terms of Service</a>
          </div>
        </div>
      </div>

      <style>{`
        .social-link:hover {
          color: var(--gold-accent) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
