import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

const subjectOptions = [
  'General Enquiry',
  'Quote Request',
  'Installation Query',
  'Warranty Claim',
  'Feedback',
  'Other',
];

const faqs = [
  {
    question: 'How long does a typical installation take?',
    answer:
      'Most kitchen worktop installations are completed within a single day. Larger or more complex projects, such as full kitchen islands with waterfall edges, may take up to two days. We will confirm the exact timeline during your design consultation.',
  },
  {
    question: 'Do you offer free samples?',
    answer:
      'Yes! We offer up to five free samples delivered to your door within 48 hours. You can request samples from any product page on our website or by calling our team on 0800 123 4567.',
  },
  {
    question: 'What areas do you cover for installation?',
    answer:
      'We provide installation services across Northamptonshire and the surrounding counties. Our team is based in Northampton, ensuring prompt and reliable service for your project.',
  },
  {
    question: 'What warranty do you offer?',
    answer:
      'All The Quartz Company worktops come with a comprehensive 25-year warranty covering manufacturing defects. Our installation work carries a separate 10-year workmanship guarantee for complete peace of mind.',
  },
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Please enter your name.';
    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    }
    if (!form.subject) {
      newErrors.subject = 'Please select a subject.';
    }
    if (!form.message.trim()) {
      newErrors.message = 'Please enter a message.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    setForm(initialForm);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="contact-page">
      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-hero__title">Get in Touch</h1>
          <p className="contact-hero__subtitle">
            Whether you have a question about our surfaces, need a quote or want
            to book an installation, our friendly team is here to help.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="contact-main section">
        <div className="container">
          <div className="contact-main__grid">
            {/* ── Left: Form ── */}
            <div className="contact-form-wrapper">
              <h2 className="contact-form__heading">Send Us a Message</h2>
              {submitted ? (
                <div className="contact-form__success">
                  <span
                    className="contact-form__success-icon"
                    aria-hidden="true"
                  >
                    &#10003;
                  </span>
                  <h3>Message Sent Successfully</h3>
                  <p>
                    Thank you for getting in touch. A member of our team will
                    respond within 24 hours. If your enquiry is urgent, please
                    call us on{' '}
                    <a href="tel:08001234567">0800 123 4567</a>.
                  </p>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Name */}
                  <div className="contact-form__group">
                    <label htmlFor="contact-name" className="contact-form__label">
                      Name <span className="contact-form__required">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      className={`contact-form__input${errors.name ? ' contact-form__input--error' : ''}`}
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <span className="contact-form__error">{errors.name}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="contact-form__group">
                    <label htmlFor="contact-email" className="contact-form__label">
                      Email <span className="contact-form__required">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      className={`contact-form__input${errors.email ? ' contact-form__input--error' : ''}`}
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.co.uk"
                    />
                    {errors.email && (
                      <span className="contact-form__error">{errors.email}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="contact-form__group">
                    <label htmlFor="contact-phone" className="contact-form__label">
                      Phone <span className="contact-form__required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      className={`contact-form__input${errors.phone ? ' contact-form__input--error' : ''}`}
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="07123 456 789"
                    />
                    {errors.phone && (
                      <span className="contact-form__error">{errors.phone}</span>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="contact-form__group">
                    <label htmlFor="contact-subject" className="contact-form__label">
                      Subject <span className="contact-form__required">*</span>
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      className={`contact-form__select${errors.subject ? ' contact-form__select--error' : ''}`}
                      value={form.subject}
                      onChange={handleChange}
                    >
                      <option value="">Select a subject</option>
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <span className="contact-form__error">
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="contact-form__group">
                    <label htmlFor="contact-message" className="contact-form__label">
                      Message <span className="contact-form__required">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className={`contact-form__textarea${errors.message ? ' contact-form__textarea--error' : ''}`}
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us about your project or enquiry..."
                    />
                    {errors.message && (
                      <span className="contact-form__error">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <button type="submit" className="btn btn--primary btn--lg contact-form__submit">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* ── Right: Contact Details ── */}
            <aside className="contact-details">
              <h2 className="contact-details__heading">Contact Details</h2>

              {/* Phone */}
              <div className="contact-details__block">
                <h4 className="contact-details__label">Phone</h4>
                <a href="tel:08001234567" className="contact-details__value contact-details__link">
                  0800 123 4567
                </a>
                <p className="contact-details__note">
                  Mon&ndash;Fri 8am&ndash;6pm, Sat 9am&ndash;4pm
                </p>
              </div>

              {/* Email */}
              <div className="contact-details__block">
                <h4 className="contact-details__label">Email</h4>
                <a href="mailto:hello@thequartzcompany.co.uk" className="contact-details__value contact-details__link">
                  hello@thequartzcompany.co.uk
                </a>
                <p className="contact-details__note">
                  We aim to respond within 24 hours
                </p>
              </div>

              {/* Address */}
              <div className="contact-details__block">
                <h4 className="contact-details__label">Address</h4>
                <p className="contact-details__value">
                  The Quartz Company Ltd
                  <br />
                  Northampton
                  <br />
                  Northamptonshire
                </p>
              </div>

              {/* Social */}
              <div className="contact-details__block">
                <h4 className="contact-details__label">Follow Us</h4>
                <div className="contact-details__social">
                  <a
                    href="https://instagram.com/thequartzcompany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-details__social-link"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://facebook.com/thequartzcompany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-details__social-link"
                    aria-label="Facebook"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://pinterest.com/thequartzcompany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-details__social-link"
                    aria-label="Pinterest"
                  >
                    Pinterest
                  </a>
                  <a
                    href="https://houzz.com/thequartzcompany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-details__social-link"
                    aria-label="Houzz"
                  >
                    Houzz
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="contact-details__map">
                <span>Map &mdash; The Quartz Company HQ</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="contact-faq section section--cream">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Before you contact us, you might find your answer here.
          </p>
          <div className="contact-faq__list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`contact-faq__item${openFaq === index ? ' contact-faq__item--open' : ''}`}
              >
                <button
                  type="button"
                  className="contact-faq__question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <span className="contact-faq__toggle" aria-hidden="true">
                    {openFaq === index ? '\u2212' : '+'}
                  </span>
                </button>
                <div className="contact-faq__answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
