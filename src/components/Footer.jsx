import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { supabase } from '../lib/supabase';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.from('leads').insert({
      full_name: trimmed,
      email: trimmed,
      source: 'newsletter',
      status: 'new',
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg('Something went wrong — please try again.');
      return;
    }

    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const browseLinks = [
    { label: 'Quartz Worktops', path: '/materials/quartz' },
    { label: 'Printed Quartz', path: '/materials/printed-quartz' },
    { label: 'All Colours', path: '/colours' },
    { label: 'Measuring Guide', path: '/measuring-guide' },
    { label: 'How to Buy', path: '/how-to-buy' },
    { label: 'Design Options', path: '/design-options' },
    { label: 'Warranty', path: '/warranty' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Cookies', path: '/cookies' },
  ];

  const socialLinks = [
    { icon: <FaInstagram />, href: 'https://www.instagram.com/thequartzcompanyuk/?hl=en', label: 'Instagram' },
    { icon: <FaFacebookF />, href: 'https://www.facebook.com/profile.php?id=61587732770864', label: 'Facebook' },
    { icon: <SiTiktok />, href: 'https://www.tiktok.com/@thequartzcompany', label: 'TikTok' },
  ];

  const trustBadges = [
    { label: 'NSF Certified' },
    { label: 'Greenguard Gold' },
    { label: 'Made in Britain' },
    { label: '25 Year Warranty' },
  ];

  return (
    <footer className="footer">
      {/* Pre-Footer Newsletter Band */}
      <section className="prefooter-newsletter">
        <div className="prefooter-newsletter__inner">
          <h3 className="prefooter-newsletter__heading">Stay Inspired</h3>
          <p className="prefooter-newsletter__subtext">
            Receive design ideas, exclusive offers and expert advice directly to your inbox.
          </p>
          <form className="prefooter-newsletter__form" onSubmit={handleSubscribe}>
            <div className="prefooter-newsletter__input-group">
              <FiMail className="prefooter-newsletter__icon" />
              <input
                type="email"
                className="prefooter-newsletter__input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="prefooter-newsletter__btn" disabled={submitting}>
                {submitting ? 'Subscribing…' : subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
            {subscribed && (
              <p className="prefooter-newsletter__success">
                Thank you for subscribing. Welcome to The Quartz Company.
              </p>
            )}
            {errorMsg && (
              <p className="prefooter-newsletter__success" style={{ color: '#dc2626' }}>
                {errorMsg}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Main Footer — 3 columns */}
      <div className="footer-main">
        <div className="footer-main__inner">
          <div className="footer-columns">
            {/* Column 1: Brand + Contact + Social */}
            <div className="footer-column footer-column--brand">
              <Link to="/" className="footer-logo">
                THE QUARTZ COMPANY
              </Link>
              <p className="footer-tagline">
                Crafting exceptional quartz worktops for discerning
                homeowners. Where precision engineering meets timeless
                elegance.
              </p>
              <div className="footer-contact-details">
                <a href="tel:+447375303416" className="footer-contact-item">
                  <FiPhone className="footer-contact-icon" />
                  <span>07375 303 416</span>
                </a>
                <a href="mailto:sales@thequartzcompany.co.uk" className="footer-contact-item">
                  <FiMail className="footer-contact-icon" />
                  <span>sales@thequartzcompany.co.uk</span>
                </a>
                <div className="footer-contact-item">
                  <FiMapPin className="footer-contact-icon" />
                  <span>Showroom in Northampton</span>
                </div>
              </div>
              <div className="footer-social">
                <span className="footer-social__label">Follow Us</span>
                <div className="footer-social__icons">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social__btn"
                      aria-label={`Follow us on ${social.label}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Browse (Resources + Company merged) */}
            <div className="footer-column">
              <h4 className="footer-column__heading">Browse</h4>
              <ul className="footer-links footer-links--two-col">
                {browseLinks.map((link) => (
                  <li key={link.path + link.label}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal + Trust Badges */}
            <div className="footer-column">
              <h4 className="footer-column__heading">Legal</h4>
              <ul className="footer-links">
                {legalLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="footer-trust-badges">
                {trustBadges.map((badge) => (
                  <span key={badge.label} className="footer-trust-pill">
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom__inner">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} The Quartz Company. All rights reserved.
            Registered in England &amp; Wales as Quartz Company SP Ltd. Company No. 17057823.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
