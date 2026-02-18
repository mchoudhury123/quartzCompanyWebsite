import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaInstagram, FaFacebookF, FaPinterestP } from 'react-icons/fa';
import { SiHouzz } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const resourcesLinks = [
    { label: 'Quartz Worktops', path: '/materials/quartz' },
    { label: 'Printed Quartz', path: '/materials/printed-quartz' },
    { label: 'Measuring Guide', path: '/measuring-guide' },
    { label: 'How to Buy', path: '/how-to-buy' },
    { label: 'Design Options', path: '/design-options' },
    { label: 'Installation Coverage', path: '/installation-coverage' },
    { label: 'Warranty', path: '/warranty' },
    { label: 'Finance', path: '/finance' },
  ];

  const companyLinks = [
    { label: 'About', path: '/about' },
    { label: 'Showroom', path: '/showrooms' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
    { label: 'Inspiration', path: '/inspiration' },
    { label: 'Our Story', path: '/our-story' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Cookies', path: '/cookies' },
    { label: 'Finance Disclosure', path: '/finance' },
  ];

  const socialLinks = [
    { icon: <FaInstagram />, href: 'https://instagram.com/thequartzcompany', label: 'Instagram' },
    { icon: <FaFacebookF />, href: 'https://facebook.com/thequartzcompany', label: 'Facebook' },
    { icon: <FaPinterestP />, href: 'https://pinterest.com/thequartzcompany', label: 'Pinterest' },
    { icon: <SiHouzz />, href: 'https://houzz.com/thequartzcompany', label: 'Houzz' },
  ];

  const trustBadges = [
    { label: 'NSF Certified', icon: '✦' },
    { label: 'Greenguard Gold', icon: '✦' },
    { label: 'Made in Britain', icon: '✦' },
    { label: '25 Year Warranty', icon: '✦' },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Signup Section */}
      <section className="footer-newsletter">
        <div className="footer-newsletter-inner">
          <div className="footer-newsletter-text">
            <h3 className="footer-newsletter-heading">Stay Inspired</h3>
            <p className="footer-newsletter-subtext">
              Receive design ideas, exclusive offers and expert advice directly to your inbox.
            </p>
          </div>
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <div className="footer-newsletter-input-group">
              <FiMail className="footer-newsletter-icon" />
              <input
                type="email"
                className="footer-newsletter-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="footer-newsletter-btn">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
            {subscribed && (
              <p className="footer-newsletter-success">
                Thank you for subscribing. Welcome to The Quartz Company.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-main-inner">
          <div className="footer-columns">
            {/* Column 1: Brand */}
            <div className="footer-column footer-column-brand">
              <Link to="/" className="footer-logo">
                THE QUARTZ COMPANY
              </Link>
              <p className="footer-tagline">
                Crafting exceptional quartz worktops for discerning
                homeowners. Where precision engineering meets timeless
                elegance.
              </p>
              <div className="footer-contact-details">
                <a href="tel:+441234567890" className="footer-contact-item">
                  <FiPhone className="footer-contact-icon" />
                  <span>0800 234 567</span>
                </a>
                <a href="mailto:hello@thequartzco.co.uk" className="footer-contact-item">
                  <FiMail className="footer-contact-icon" />
                  <span>hello@thequartzco.co.uk</span>
                </a>
                <div className="footer-contact-item">
                  <FiMapPin className="footer-contact-icon" />
                  <span>Showroom in Northampton</span>
                </div>
              </div>
            </div>

            {/* Column 2: Resources */}
            <div className="footer-column">
              <h4 className="footer-column-heading">Resources</h4>
              <ul className="footer-links">
                {resourcesLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="footer-column">
              <h4 className="footer-column-heading">Company</h4>
              <ul className="footer-links">
                {companyLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="footer-column">
              <h4 className="footer-column-heading">Legal</h4>
              <ul className="footer-links">
                {legalLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="footer-social">
            <span className="footer-social-label">Follow Us</span>
            <div className="footer-social-icons">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label={`Follow us on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="footer-trust-badges">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="footer-trust-badge">
                <span className="footer-trust-badge-icon">{badge.icon}</span>
                <span className="footer-trust-badge-label">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} The Quartz Company Ltd. All rights reserved.
            Registered in England &amp; Wales. Company No. 12345678.
          </p>
          <p className="footer-fca-disclaimer">
            The Quartz Company Ltd is authorised and regulated by the Financial Conduct
            Authority (FCA) for credit broking activities. FCA registration number:
            123456. Finance is subject to status. Terms and conditions apply. The Quartz
            Company Ltd acts as a credit broker, not a lender, and offers credit products
            from a panel of lenders. Applicants must be 18 or over. Guarantee may be
            required.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
