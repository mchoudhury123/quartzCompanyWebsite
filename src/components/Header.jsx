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

const navLinks = [
  { label: "Our Worktops", path: "/colours", hasDropdown: true },
  { label: "Design Options", path: "/design-options" },
  { label: "Inspiration", path: "/inspiration" },
  { label: "Sale", path: "/sale" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimerRef = useRef(null);

  // Sticky header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
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

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimerRef.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(false);
  };

  return (
    <header
      className={`site-header${scrolled ? " site-header--scrolled" : ""}`}
    >
      {/* ── Announcement Bar ── */}
      <div className="announcement-bar" role="banner">
        <div className="announcement-bar__inner">
          <p className="announcement-bar__text">
            <span className="announcement-bar__highlight">Spring Sale</span>
            {" — Up to 35% off all worktops. Free local delivery."}
            <Link to="/sale" className="announcement-bar__link">
              Shop&nbsp;Now
            </Link>
          </p>
          <a href="tel:+441234567890" className="announcement-bar__phone">
            <FiPhone aria-hidden="true" />
            <span>01234 567 890</span>
          </a>
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <nav
        className="main-nav"
        aria-label="Primary navigation"
      >
        <div className="main-nav__inner">
          {/* Logo */}
          <Link to="/" className="main-nav__logo" aria-label="The Quartz Company home">
            <span className="main-nav__logo-text">THE QUARTZ COMPANY</span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="main-nav__links" role="menubar">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <li
                  key={link.label}
                  className="main-nav__item main-nav__item--has-dropdown"
                  ref={dropdownRef}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                  role="none"
                >
                  <button
                    className="main-nav__link main-nav__link--dropdown-toggle"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    type="button"
                    role="menuitem"
                  >
                    {link.label}
                    <FiChevronDown
                      className={`main-nav__chevron${
                        dropdownOpen ? " main-nav__chevron--open" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <ul
                    className={`main-nav__dropdown${
                      dropdownOpen ? " main-nav__dropdown--open" : ""
                    }`}
                    role="menu"
                    aria-label="Our Worktops submenu"
                  >
                    {worktopsDropdown.map((sub) => (
                      <li key={sub.label} role="none">
                        <Link
                          to={sub.path}
                          className="main-nav__dropdown-link"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.label} className="main-nav__item" role="none">
                  <Link
                    to={link.path}
                    className={`main-nav__link${
                      link.label === "Sale" ? " main-nav__link--sale" : ""
                    }`}
                    role="menuitem"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Right-side CTAs */}
          <div className="main-nav__actions">
            <Link
              to="/quote"
              className="btn btn--gold"
              aria-label="Get a free quote and order samples"
            >
              Get Quote &amp; Samples
            </Link>
            <Link
              to="/brochure"
              className="btn btn--outline"
              aria-label="Request a free brochure"
            >
              Request Brochure
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="main-nav__hamburger"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <FiX aria-hidden="true" />
            ) : (
              <FiMenu aria-hidden="true" />
            )}
          </button>
        </div>

        {/* ── Mobile Menu Panel ── */}
        <div
          id="mobile-menu"
          className={`mobile-menu${mobileMenuOpen ? " mobile-menu--open" : ""}`}
          aria-hidden={!mobileMenuOpen}
        >
          <ul className="mobile-menu__links" role="menu">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <li
                  key={link.label}
                  className="mobile-menu__item mobile-menu__item--has-dropdown"
                  role="none"
                >
                  <button
                    type="button"
                    className="mobile-menu__link mobile-menu__link--dropdown-toggle"
                    aria-expanded={mobileDropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    role="menuitem"
                  >
                    {link.label}
                    <FiChevronDown
                      className={`mobile-menu__chevron${
                        mobileDropdownOpen
                          ? " mobile-menu__chevron--open"
                          : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <ul
                    className={`mobile-menu__dropdown${
                      mobileDropdownOpen
                        ? " mobile-menu__dropdown--open"
                        : ""
                    }`}
                    role="menu"
                    aria-label="Our Worktops submenu"
                  >
                    {worktopsDropdown.map((sub) => (
                      <li key={sub.label} role="none">
                        <Link
                          to={sub.path}
                          className="mobile-menu__dropdown-link"
                          role="menuitem"
                          onClick={closeMobileMenu}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.label} className="mobile-menu__item" role="none">
                  <Link
                    to={link.path}
                    className={`mobile-menu__link${
                      link.label === "Sale" ? " mobile-menu__link--sale" : ""
                    }`}
                    role="menuitem"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Mobile CTA Buttons */}
          <div className="mobile-menu__actions">
            <Link
              to="/quote"
              className="btn btn--gold btn--full"
              aria-label="Get a free quote and order samples"
              onClick={closeMobileMenu}
            >
              Get Quote &amp; Samples
            </Link>
            <Link
              to="/brochure"
              className="btn btn--outline btn--full"
              aria-label="Request a free brochure"
              onClick={closeMobileMenu}
            >
              Request Brochure
            </Link>
          </div>

          {/* Mobile Phone Link */}
          <a href="tel:+441234567890" className="mobile-menu__phone">
            <FiPhone aria-hidden="true" />
            <span>01234 567 890</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
