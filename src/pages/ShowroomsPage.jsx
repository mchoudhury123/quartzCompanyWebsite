import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ShowroomsPage.css';

const showrooms = [
  {
    id: 'northampton',
    name: 'Northampton Showroom',
    tagline: 'Our showroom with over 200 surfaces on display',
    description:
      'Our Northampton showroom is the home of The Quartz Company. It features full kitchen displays, our complete material library and a dedicated design consultation suite. This is the ideal place to explore the full range of quartz and full body printed quartz worktops before making your decision.',
    address: 'Northampton, Northamptonshire',
    phone: '01234 567 890',
    hours: 'Mon\u2013Sat 9am\u20135pm, Sun by appointment',
  },
];

const accessories = [
  {
    name: 'Designer Taps',
    description: 'Boiling water, filtered and mixer taps from leading brands',
  },
  {
    name: 'Undermount Sinks',
    description: 'Stainless steel and composite options to match your worktop',
  },
  {
    name: 'Splashbacks',
    description: 'Matching stone, glass and composite splashback solutions',
  },
  {
    name: 'Edge Profiles',
    description: 'Over 15 edge profiles to see and feel, from pencil round to ogee',
  },
];

const initialBooking = {
  showroom: '',
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
};

function ShowroomsPage() {
  const [booking, setBooking] = useState(initialBooking);
  const [bookingErrors, setBookingErrors] = useState({});
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
    if (bookingErrors[name]) {
      setBookingErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateBooking = () => {
    const errs = {};
    if (!booking.showroom) errs.showroom = 'Please select a showroom.';
    if (!booking.date) errs.date = 'Please choose a preferred date.';
    if (!booking.time) errs.time = 'Please choose a preferred time.';
    if (!booking.name.trim()) errs.name = 'Please enter your name.';
    if (!booking.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!booking.phone.trim()) errs.phone = 'Please enter your phone number.';
    return errs;
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const errs = validateBooking();
    if (Object.keys(errs).length > 0) {
      setBookingErrors(errs);
      return;
    }
    setBookingErrors({});
    setBookingSubmitted(true);
    setBooking(initialBooking);
  };

  return (
    <div className="showrooms-page">
      {/* ── Hero ── */}
      <section className="showrooms-hero">
        <div className="container">
          <h1 className="showrooms-hero__title">Visit Our Showroom</h1>
          <p className="showrooms-hero__subtitle">
            See and touch our surfaces in person. Our experts are on hand to
            help you find the perfect worktop for your project.
          </p>
        </div>
      </section>

      {/* ── Showroom Cards ── */}
      <section className="showrooms-locations section">
        <div className="container">
          <div className="showrooms-locations__grid">
            {showrooms.map((room) => (
              <article key={room.id} className="showroom-card">
                <div className="showroom-card__image">
                  <div className="showroom-card__image-placeholder">
                    <span>{room.name}</span>
                  </div>
                </div>
                <div className="showroom-card__body">
                  <h2 className="showroom-card__name">{room.name}</h2>
                  <p className="showroom-card__tagline">{room.tagline}</p>
                  <p className="showroom-card__description">
                    {room.description}
                  </p>
                  <div className="showroom-card__details">
                    <div className="showroom-card__detail">
                      <span className="showroom-card__detail-label">Address</span>
                      <span className="showroom-card__detail-value">
                        {room.address}
                      </span>
                    </div>
                    <div className="showroom-card__detail">
                      <span className="showroom-card__detail-label">Phone</span>
                      <a
                        href={`tel:${room.phone.replace(/\s/g, '')}`}
                        className="showroom-card__detail-value showroom-card__detail-link"
                      >
                        {room.phone}
                      </a>
                    </div>
                    <div className="showroom-card__detail">
                      <span className="showroom-card__detail-label">Opening Hours</span>
                      <span className="showroom-card__detail-value">
                        {room.hours}
                      </span>
                    </div>
                  </div>
                  <div className="showroom-card__actions">
                    <a href="#booking" className="btn btn--primary">
                      Book an Appointment
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(room.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="showroom-card__directions"
                    >
                      Get Directions &rarr;
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Form ── */}
      <section id="booking" className="showrooms-booking section section--cream">
        <div className="container">
          <div className="showrooms-booking__grid">
            <div className="showrooms-booking__form-wrapper">
              <h2 className="showrooms-booking__heading">
                Book a Showroom Appointment
              </h2>
              {bookingSubmitted ? (
                <div className="showrooms-booking__success">
                  <span
                    className="showrooms-booking__success-icon"
                    aria-hidden="true"
                  >
                    &#10003;
                  </span>
                  <h3>Appointment Request Sent</h3>
                  <p>
                    Thank you for booking. We will confirm your appointment
                    within 24 hours via email. If you need to make changes,
                    please call us directly.
                  </p>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => setBookingSubmitted(false)}
                  >
                    Book Another Appointment
                  </button>
                </div>
              ) : (
                <form
                  className="showrooms-booking__form"
                  onSubmit={handleBookingSubmit}
                  noValidate
                >
                  {/* Showroom */}
                  <div className="showrooms-booking__group">
                    <label htmlFor="booking-showroom" className="showrooms-booking__label">
                      Showroom <span className="showrooms-booking__req">*</span>
                    </label>
                    <select
                      id="booking-showroom"
                      name="showroom"
                      className={`showrooms-booking__select${bookingErrors.showroom ? ' showrooms-booking__select--error' : ''}`}
                      value={booking.showroom}
                      onChange={handleBookingChange}
                    >
                      <option value="">Select a showroom</option>
                      {showrooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                    {bookingErrors.showroom && (
                      <span className="showrooms-booking__error">
                        {bookingErrors.showroom}
                      </span>
                    )}
                  </div>

                  {/* Date and Time row */}
                  <div className="showrooms-booking__row">
                    <div className="showrooms-booking__group">
                      <label htmlFor="booking-date" className="showrooms-booking__label">
                        Preferred Date{' '}
                        <span className="showrooms-booking__req">*</span>
                      </label>
                      <input
                        type="date"
                        id="booking-date"
                        name="date"
                        className={`showrooms-booking__input${bookingErrors.date ? ' showrooms-booking__input--error' : ''}`}
                        value={booking.date}
                        onChange={handleBookingChange}
                      />
                      {bookingErrors.date && (
                        <span className="showrooms-booking__error">
                          {bookingErrors.date}
                        </span>
                      )}
                    </div>
                    <div className="showrooms-booking__group">
                      <label htmlFor="booking-time" className="showrooms-booking__label">
                        Preferred Time{' '}
                        <span className="showrooms-booking__req">*</span>
                      </label>
                      <select
                        id="booking-time"
                        name="time"
                        className={`showrooms-booking__select${bookingErrors.time ? ' showrooms-booking__select--error' : ''}`}
                        value={booking.time}
                        onChange={handleBookingChange}
                      >
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                      {bookingErrors.time && (
                        <span className="showrooms-booking__error">
                          {bookingErrors.time}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="showrooms-booking__group">
                    <label htmlFor="booking-name" className="showrooms-booking__label">
                      Name <span className="showrooms-booking__req">*</span>
                    </label>
                    <input
                      type="text"
                      id="booking-name"
                      name="name"
                      className={`showrooms-booking__input${bookingErrors.name ? ' showrooms-booking__input--error' : ''}`}
                      value={booking.name}
                      onChange={handleBookingChange}
                      placeholder="Your full name"
                    />
                    {bookingErrors.name && (
                      <span className="showrooms-booking__error">
                        {bookingErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Email and Phone row */}
                  <div className="showrooms-booking__row">
                    <div className="showrooms-booking__group">
                      <label htmlFor="booking-email" className="showrooms-booking__label">
                        Email <span className="showrooms-booking__req">*</span>
                      </label>
                      <input
                        type="email"
                        id="booking-email"
                        name="email"
                        className={`showrooms-booking__input${bookingErrors.email ? ' showrooms-booking__input--error' : ''}`}
                        value={booking.email}
                        onChange={handleBookingChange}
                        placeholder="you@example.co.uk"
                      />
                      {bookingErrors.email && (
                        <span className="showrooms-booking__error">
                          {bookingErrors.email}
                        </span>
                      )}
                    </div>
                    <div className="showrooms-booking__group">
                      <label htmlFor="booking-phone" className="showrooms-booking__label">
                        Phone <span className="showrooms-booking__req">*</span>
                      </label>
                      <input
                        type="tel"
                        id="booking-phone"
                        name="phone"
                        className={`showrooms-booking__input${bookingErrors.phone ? ' showrooms-booking__input--error' : ''}`}
                        value={booking.phone}
                        onChange={handleBookingChange}
                        placeholder="07123 456 789"
                      />
                      {bookingErrors.phone && (
                        <span className="showrooms-booking__error">
                          {bookingErrors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn--gold btn--lg showrooms-booking__submit"
                  >
                    Request Appointment
                  </button>
                </form>
              )}
            </div>

            {/* What to Expect */}
            <div className="showrooms-booking__info">
              <h3 className="showrooms-booking__info-heading">
                What to Expect
              </h3>
              <ul className="showrooms-booking__expect-list">
                <li>
                  Browse our full range of over 200 quartz
                  surfaces
                </li>
                <li>
                  Discuss your project one-to-one with an experienced kitchen
                  designer
                </li>
                <li>
                  Take home up to five free samples to compare in your own
                  kitchen
                </li>
                <li>
                  Explore edge profiles, splashback options and sink pairings
                </li>
                <li>
                  Receive a no-obligation quote tailored to your project
                </li>
              </ul>
              <p className="showrooms-booking__info-note">
                Appointments typically last 45&ndash;60 minutes. Walk-ins are
                welcome, but booking ensures a designer is available for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Accessories on Display ── */}
      <section className="showrooms-accessories section">
        <div className="container">
          <h2 className="section-title">Accessories on Display</h2>
          <p className="section-subtitle">
            Complete your kitchen project with our curated selection of taps,
            sinks, splashbacks and finishing touches.
          </p>
          <div className="showrooms-accessories__grid">
            {accessories.map((item) => (
              <div key={item.name} className="showrooms-accessories__card">
                <div className="showrooms-accessories__icon" aria-hidden="true">
                  &#9670;
                </div>
                <h3 className="showrooms-accessories__name">{item.name}</h3>
                <p className="showrooms-accessories__desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Can't Visit Info Box ── */}
      <section className="showrooms-remote section section--cream">
        <div className="container">
          <div className="showrooms-remote__box">
            <div className="showrooms-remote__content">
              <h2 className="showrooms-remote__heading">
                Can&rsquo;t Visit in Person?
              </h2>
              <p className="showrooms-remote__text">
                No problem. We will post up to five free samples directly to
                your door, anywhere in the UK, within 48 hours. You can also
                arrange a video consultation with one of our designers from the
                comfort of your home.
              </p>
              <div className="showrooms-remote__actions">
                <Link to="/colours" className="btn btn--primary">
                  Browse Colours &amp; Order Samples
                </Link>
                <Link to="/contact" className="btn btn--outline">
                  Arrange a Video Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShowroomsPage;
