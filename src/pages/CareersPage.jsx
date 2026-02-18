import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CareersPage.css';

const benefits = [
  {
    icon: '\u2692',
    title: 'Skilled Craft',
    description:
      'Work with premium engineered quartz using cutting-edge CNC technology. Every day brings new challenges and the satisfaction of creating something beautiful.',
  },
  {
    icon: '\u2191',
    title: 'Career Growth',
    description:
      'From apprenticeship programmes to NVQ qualifications and management training, we invest in our people at every stage of their career.',
  },
  {
    icon: '\u2605',
    title: 'Great Benefits',
    description:
      'Competitive salary, company pension, 25 days holiday plus bank holidays, staff discount on worktops and free on-site parking.',
  },
  {
    icon: '\u2665',
    title: 'Team Culture',
    description:
      'A friendly, supportive workshop environment with regular team events, summer BBQs and an annual company trip. We work hard and look after each other.',
  },
];

const vacancies = [
  {
    id: 'cnc-operator',
    title: 'CNC Operator',
    location: 'Northampton',
    salary: '\u00A328,000 \u2013 \u00A335,000',
    type: 'Full-time',
    description:
      'Operate and maintain five-axis CNC machines to fabricate quartz worktops to precise specifications. You will read technical drawings, set up tooling and ensure every piece meets our exacting quality standards. Previous CNC experience in stone or similar materials is preferred but full training is provided.',
  },
  {
    id: 'installation-tech',
    title: 'Installation Technician',
    location: 'Northampton & surrounding areas',
    salary: '\u00A332,000 \u2013 \u00A340,000 + van',
    type: 'Full-time',
    description:
      'Join our installation team delivering and fitting premium worktops in customers\u2019 homes across Northamptonshire and the surrounding counties. You will carry out on-site templating, precise fitting, joint work and final polishing. A full UK driving licence is required. Experience in kitchen fitting or stone installation is a strong advantage.',
  },
  {
    id: 'kitchen-designer',
    title: 'Kitchen Designer',
    location: 'Northampton',
    salary: '\u00A330,000 \u2013 \u00A338,000 + commission',
    type: 'Full-time',
    description:
      'Work from our Northampton showroom to guide homeowners and trade clients through the surface selection process. You will conduct showroom consultations, create design proposals and manage projects from enquiry through to installation. Previous experience in kitchen or interior design is essential.',
  },
];

const initialApplication = {
  name: '',
  email: '',
  phone: '',
  position: '',
  coverLetter: '',
};

function CareersPage() {
  const [application, setApplication] = useState(initialApplication);
  const [applicationErrors, setApplicationErrors] = useState({});
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
    if (applicationErrors[name]) {
      setApplicationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      if (applicationErrors.cv) {
        setApplicationErrors((prev) => ({ ...prev, cv: '' }));
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!application.name.trim()) errs.name = 'Please enter your name.';
    if (!application.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!application.phone.trim())
      errs.phone = 'Please enter your phone number.';
    if (!application.position) errs.position = 'Please select a position.';
    if (!fileName) errs.cv = 'Please attach your CV.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setApplicationErrors(errs);
      return;
    }
    setApplicationErrors({});
    setApplicationSubmitted(true);
    setApplication(initialApplication);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const scrollToApplication = (positionId) => {
    setApplication((prev) => ({ ...prev, position: positionId }));
    const el = document.getElementById('apply');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="careers-page">
      {/* ── Hero ── */}
      <section className="careers-hero">
        <div className="container">
          <h1 className="careers-hero__title">Join Our Team</h1>
          <p className="careers-hero__subtitle">
            Build your career with one of Britain&rsquo;s leading surface
            specialists
          </p>
        </div>
      </section>

      {/* ── Why Work With Us ── */}
      <section className="careers-benefits section">
        <div className="container">
          <h2 className="section-title">Why Work With Us</h2>
          <p className="section-subtitle">
            At The Quartz Company, you will join a team of passionate professionals
            who take pride in creating exceptional surfaces.
          </p>
          <div className="careers-benefits__grid">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="careers-benefits__card">
                <span
                  className="careers-benefits__icon"
                  aria-hidden="true"
                >
                  {benefit.icon}
                </span>
                <h3 className="careers-benefits__card-title">
                  {benefit.title}
                </h3>
                <p className="careers-benefits__card-text">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Current Vacancies ── */}
      <section className="careers-vacancies section section--cream">
        <div className="container">
          <h2 className="section-title">Current Vacancies</h2>
          <p className="section-subtitle">
            Explore our open roles and find where you fit in.
          </p>
          <div className="careers-vacancies__list">
            {vacancies.map((job) => (
              <article key={job.id} className="vacancy-card">
                <div className="vacancy-card__header">
                  <div>
                    <h3 className="vacancy-card__title">{job.title}</h3>
                    <div className="vacancy-card__meta">
                      <span className="vacancy-card__tag">{job.location}</span>
                      <span className="vacancy-card__tag">{job.type}</span>
                      <span className="vacancy-card__salary">{job.salary}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn--gold vacancy-card__apply-btn"
                    onClick={() => scrollToApplication(job.id)}
                  >
                    Apply Now
                  </button>
                </div>
                <p className="vacancy-card__description">{job.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Form ── */}
      <section id="apply" className="careers-apply section">
        <div className="container">
          <div className="careers-apply__grid">
            <div className="careers-apply__form-wrapper">
              <h2 className="careers-apply__heading">Apply Now</h2>
              {applicationSubmitted ? (
                <div className="careers-apply__success">
                  <span
                    className="careers-apply__success-icon"
                    aria-hidden="true"
                  >
                    &#10003;
                  </span>
                  <h3>Application Submitted</h3>
                  <p>
                    Thank you for your interest in joining The Quartz Company. Our
                    HR team will review your application and be in touch within
                    five working days.
                  </p>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => setApplicationSubmitted(false)}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form
                  className="careers-apply__form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Name */}
                  <div className="careers-apply__group">
                    <label
                      htmlFor="apply-name"
                      className="careers-apply__label"
                    >
                      Full Name{' '}
                      <span className="careers-apply__req">*</span>
                    </label>
                    <input
                      type="text"
                      id="apply-name"
                      name="name"
                      className={`careers-apply__input${applicationErrors.name ? ' careers-apply__input--error' : ''}`}
                      value={application.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                    {applicationErrors.name && (
                      <span className="careers-apply__error">
                        {applicationErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="careers-apply__group">
                    <label
                      htmlFor="apply-email"
                      className="careers-apply__label"
                    >
                      Email{' '}
                      <span className="careers-apply__req">*</span>
                    </label>
                    <input
                      type="email"
                      id="apply-email"
                      name="email"
                      className={`careers-apply__input${applicationErrors.email ? ' careers-apply__input--error' : ''}`}
                      value={application.email}
                      onChange={handleChange}
                      placeholder="you@example.co.uk"
                    />
                    {applicationErrors.email && (
                      <span className="careers-apply__error">
                        {applicationErrors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="careers-apply__group">
                    <label
                      htmlFor="apply-phone"
                      className="careers-apply__label"
                    >
                      Phone{' '}
                      <span className="careers-apply__req">*</span>
                    </label>
                    <input
                      type="tel"
                      id="apply-phone"
                      name="phone"
                      className={`careers-apply__input${applicationErrors.phone ? ' careers-apply__input--error' : ''}`}
                      value={application.phone}
                      onChange={handleChange}
                      placeholder="07123 456 789"
                    />
                    {applicationErrors.phone && (
                      <span className="careers-apply__error">
                        {applicationErrors.phone}
                      </span>
                    )}
                  </div>

                  {/* Position */}
                  <div className="careers-apply__group">
                    <label
                      htmlFor="apply-position"
                      className="careers-apply__label"
                    >
                      Position{' '}
                      <span className="careers-apply__req">*</span>
                    </label>
                    <select
                      id="apply-position"
                      name="position"
                      className={`careers-apply__select${applicationErrors.position ? ' careers-apply__select--error' : ''}`}
                      value={application.position}
                      onChange={handleChange}
                    >
                      <option value="">Select a position</option>
                      {vacancies.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} &mdash; {job.location}
                        </option>
                      ))}
                      <option value="speculative">
                        Speculative Application
                      </option>
                    </select>
                    {applicationErrors.position && (
                      <span className="careers-apply__error">
                        {applicationErrors.position}
                      </span>
                    )}
                  </div>

                  {/* CV Upload */}
                  <div className="careers-apply__group">
                    <label
                      htmlFor="apply-cv"
                      className="careers-apply__label"
                    >
                      Upload CV{' '}
                      <span className="careers-apply__req">*</span>
                    </label>
                    <div className="careers-apply__file-wrapper">
                      <input
                        type="file"
                        id="apply-cv"
                        name="cv"
                        className="careers-apply__file-input"
                        accept=".pdf,.doc,.docx"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="apply-cv"
                        className={`careers-apply__file-label${applicationErrors.cv ? ' careers-apply__file-label--error' : ''}`}
                      >
                        {fileName || 'Choose file (PDF, DOC, DOCX)'}
                      </label>
                    </div>
                    {applicationErrors.cv && (
                      <span className="careers-apply__error">
                        {applicationErrors.cv}
                      </span>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div className="careers-apply__group">
                    <label
                      htmlFor="apply-cover"
                      className="careers-apply__label"
                    >
                      Cover Letter{' '}
                      <span className="careers-apply__optional">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="apply-cover"
                      name="coverLetter"
                      className="careers-apply__textarea"
                      value={application.coverLetter}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us why you'd like to join The Quartz Company..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn--gold btn--lg careers-apply__submit"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <aside className="careers-apply__sidebar">
              <div className="careers-apply__speculative">
                <h3 className="careers-apply__sidebar-heading">
                  No Suitable Role?
                </h3>
                <p>
                  We are always on the lookout for talented people. If you do
                  not see a role that matches your skills, we welcome
                  speculative applications. Simply select &ldquo;Speculative
                  Application&rdquo; from the position dropdown, attach your CV
                  and tell us what you could bring to the team.
                </p>
                <p>
                  We will keep your details on file for six months and contact
                  you if a suitable opportunity arises.
                </p>
              </div>

              <div className="careers-apply__contact-info">
                <h3 className="careers-apply__sidebar-heading">
                  Have Questions?
                </h3>
                <p>
                  Contact our HR team directly:
                </p>
                <p>
                  <a href="mailto:careers@thequartzcompany.co.uk">
                    careers@thequartzcompany.co.uk
                  </a>
                  <br />
                  <a href="tel:08001234567">0800 123 4567</a> (ask for HR)
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CareersPage;
