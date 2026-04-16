import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiPhone } from "react-icons/fi";
import "./Header.css";

const worktopsDropdown = [
  { label: "Quartz Worktops", path: "/materials/quartz" },
  { label: "Full Body Printed Quartz", path: "/materials/printed-quartz" },
  { label: "All Colours", path: "/colours" },
  { label: "Veined", path: "/colours/veined" },
  { label: "Plain & Speckled", path: "/colours/plain" },
];

const popularColours = [
  { label: "Calacatta Gold", path: "/colours/veined" },
  { label: "Statuario White", path: "/colours/veined" },
  { label: "Concrete Grey", path: "/colours" },
];

const quickLinks = [
  { label: "Measuring Guide", path: "/measuring-guide" },
  { label: "How to Buy", path: "/how-to-buy" },
  { label: "Design Options", path: "/design-options" },
  { label: "Request Brochure", path: "/quote" },
];

const navLinksLeft = [
  { label: "Our Worktops", path: "/colours", hasDropdown: true },
  { label: "Design Options", path: "/design-options" },
];

const navLinksRight = [
  { label: "Sale", path: "/sale", isSale: true },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaMenuRef = useRef(null);
  const megaMenuTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMegaEnter = () => {
    clearTimeout(megaMenuTimerRef.current);
    setMegaMenuOpen(true);
  };

  const handleMegaLeave = () => {
    megaMenuTimerRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(false);
  };

  const renderNavLink = (link, side) =>
    link.hasDropdown ? (
      <li
        key={link.label}
        className="split-nav__item split-nav__item--has-dropdown"
        ref={megaMenuRef}
        onMouseEnter={handleMegaEnter}
        onMouseLeave={handleMegaLeave}
        role="none"
      >
        <button
          className="split-nav__link split-nav__link--dropdown-toggle"
          aria-expanded={megaMenuOpen}
          aria-haspopup="true"
          onClick={() => setMegaMenuOpen((prev) => !prev)}
          type="button"
          role="menuitem"
        >
          {link.label}
          <FiChevronDown
            className={`split-nav__chevron${megaMenuOpen ? " split-nav__chevron--open" : ""}`}
            aria-hidden="true"
          />
        </button>

        {/* Mega Menu */}
        <div className={`mega-menu${megaMenuOpen ? " mega-menu--open" : ""}`} role="menu" aria-label="Our Worktops submenu">
          <div className="mega-menu__inner">
            <div className="mega-menu__column">
              <h4 className="mega-menu__heading">Worktop Types</h4>
              <ul className="mega-menu__list">
                {worktopsDropdown.map((sub) => (
                  <li key={sub.label}>
                    <Link to={sub.path} className="mega-menu__link" role="menuitem" onClick={() => setMegaMenuOpen(false)}>
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mega-menu__column">
              <h4 className="mega-menu__heading">Popular Colours</h4>
              <ul className="mega-menu__list">
                {popularColours.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="mega-menu__link" role="menuitem" onClick={() => setMegaMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mega-menu__column">
              <h4 className="mega-menu__heading">Quick Links</h4>
              <ul className="mega-menu__list">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="mega-menu__link" role="menuitem" onClick={() => setMegaMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </li>
    ) : (
      <li key={link.label} className="split-nav__item" role="none">
        <Link
          to={link.path}
          className={`split-nav__link${link.isSale ? " split-nav__link--sale" : ""}`}
          role="menuitem"
        >
          {link.label}
        </Link>
      </li>
    );

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
      {/* Marquee Announcement Bar */}
      <div className="ticker-bar" role="banner">
        <div className="ticker-bar__track">
          <span className="ticker-bar__content">
            <span className="ticker-bar__highlight">Grand Opening Sale</span>
            {" — Up to 40% off all worktops. Free local delivery. "}
            <Link to="/sale" className="ticker-bar__link">Shop Now</Link>
            <span className="ticker-bar__separator">|</span>
            <span className="ticker-bar__highlight">Grand Opening Sale</span>
            {" — Up to 40% off all worktops. Free local delivery. "}
            <Link to="/sale" className="ticker-bar__link">Shop Now</Link>
            <span className="ticker-bar__separator">|</span>
          </span>
          <span className="ticker-bar__content" aria-hidden="true">
            <span className="ticker-bar__highlight">Grand Opening Sale</span>
            {" — Up to 40% off all worktops. Free local delivery. "}
            <Link to="/sale" className="ticker-bar__link" tabIndex={-1}>Shop Now</Link>
            <span className="ticker-bar__separator">|</span>
            <span className="ticker-bar__highlight">Grand Opening Sale</span>
            {" — Up to 40% off all worktops. Free local delivery. "}
            <Link to="/sale" className="ticker-bar__link" tabIndex={-1}>Shop Now</Link>
            <span className="ticker-bar__separator">|</span>
          </span>
        </div>
        <a href="tel:+447375303416" className="ticker-bar__phone">
          <FiPhone aria-hidden="true" />
          <span>07375 303 416</span>
        </a>
      </div>

      {/* Centered-Logo Split Navigation */}
      <nav className="split-nav" aria-label="Primary navigation">
        <div className="split-nav__inner">
          {/* Left nav links */}
          <ul className="split-nav__links split-nav__links--left" role="menubar">
            {navLinksLeft.map((link) => renderNavLink(link, "left"))}
          </ul>

          {/* Centered Logo */}
          <Link to="/" className="split-nav__logo" aria-label="The Quartz Company home">
            <span className="split-nav__logo-text">THE QUARTZ COMPANY</span>
          </Link>

          {/* Right nav links */}
          <ul className="split-nav__links split-nav__links--right" role="menubar">
            {navLinksRight.map((link) => renderNavLink(link, "right"))}
          </ul>

          {/* Single CTA */}
          <div className="split-nav__cta">
            <Link to="/quote" className="btn btn--gold" aria-label="Get a free quote">
              Get Quote
            </Link>
          </div>

          {/* Hamburger */}
          <button
            type="button"
            className="split-nav__hamburger"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-overlay"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        id="mobile-overlay"
        className={`mobile-overlay${mobileMenuOpen ? " mobile-overlay--open" : ""}`}
        aria-hidden={!mobileMenuOpen}
        onClick={closeMobileMenu}
      >
        <div className="mobile-overlay__panel" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-overlay__header">
            <Link to="/" className="mobile-overlay__logo" onClick={closeMobileMenu} aria-label="The Quartz Company home">
              <span className="mobile-overlay__logo-text">THE QUARTZ COMPANY</span>
            </Link>
          </div>
          <ul className="mobile-overlay__links" role="menu">
            {[...navLinksLeft, ...navLinksRight].map((link) =>
              link.hasDropdown ? (
                <li key={link.label} className="mobile-overlay__item" role="none">
                  <button
                    type="button"
                    className="mobile-overlay__link mobile-overlay__link--toggle"
                    aria-expanded={mobileDropdownOpen}
                    onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    role="menuitem"
                  >
                    {link.label}
                    <FiChevronDown
                      className={`mobile-overlay__chevron${mobileDropdownOpen ? " mobile-overlay__chevron--open" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <ul className={`mobile-overlay__dropdown${mobileDropdownOpen ? " mobile-overlay__dropdown--open" : ""}`} role="menu">
                    {worktopsDropdown.map((sub) => (
                      <li key={sub.label} role="none">
                        <Link to={sub.path} className="mobile-overlay__dropdown-link" role="menuitem" onClick={closeMobileMenu}>
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.label} className="mobile-overlay__item" role="none">
                  <Link
                    to={link.path}
                    className={`mobile-overlay__link${link.isSale ? " mobile-overlay__link--sale" : ""}`}
                    role="menuitem"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="mobile-overlay__footer">
            <Link to="/quote" className="btn btn--gold btn--full" onClick={closeMobileMenu}>
              Get Quote
            </Link>
            <a href="tel:+447375303416" className="mobile-overlay__phone">
              <FiPhone aria-hidden="true" />
              <span>07375 303 416</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
