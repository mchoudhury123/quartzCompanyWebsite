import React, { useState, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheck, FiUploadCloud, FiX, FiPlus, FiCalendar } from 'react-icons/fi';
import products from '../data/products.json';
import './QuotePage.css';

/* Validation helpers */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidUKPostcode = (pc) =>
  /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(pc.trim());

const MAX_COLOURS = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.pdf';

export default function QuotePage() {
  const [searchParams] = useSearchParams();
  const preselectedSlug = searchParams.get('product');

  /* ── Step 1: Material Selection ── */
  const [selectedIds, setSelectedIds] = useState(() => {
    if (preselectedSlug) {
      const found = products.find((p) => p.slug === preselectedSlug);
      return found ? [found.id] : [];
    }
    return [];
  });
  const [selectionWarning, setSelectionWarning] = useState(false);
  const [wantSamples, setWantSamples] = useState(null);

  /* ── Step 2: Kitchen Plan ── */
  const [planMode, setPlanMode] = useState(null);
  const [worktopRuns, setWorktopRuns] = useState([{ length: '', width: '' }]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  /* ── Step 3: Your Details ── */
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postcode: '',
    installDate: '',
  });
  const [honeypot, setHoneypot] = useState('');

  /* ── Validation & Submission ── */
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* Refs for scroll-to-error */
  const sectionRefs = {
    products: useRef(null),
    details: useRef(null),
  };

  /* ── Handlers: Step 1 ── */
  const toggleProduct = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_COLOURS) {
        setSelectionWarning(true);
        setTimeout(() => setSelectionWarning(false), 3000);
        return prev;
      }
      return [...prev, id];
    });
    if (errors.products) setErrors((prev) => ({ ...prev, products: '' }));
  };

  /* ── Handlers: Step 2 ── */
  const updateRun = (index, field, value) => {
    setWorktopRuns((prev) =>
      prev.map((run, i) => (i === index ? { ...run, [field]: value } : run))
    );
  };

  const addRun = () => {
    if (worktopRuns.length < 5) {
      setWorktopRuns((prev) => [...prev, { length: '', width: '' }]);
    }
  };

  const removeRun = (index) => {
    if (worktopRuns.length > 1) {
      setWorktopRuns((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('File must be under 10 MB.');
      return;
    }
    setUploadedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  /* ── Handlers: Step 3 ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (selectedIds.length === 0) errs.products = 'Please select at least one colour.';
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) errs.email = 'Email address is required.';
    else if (!isValidEmail(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    if (!form.postcode.trim()) errs.postcode = 'Postcode is required.';
    else if (!isValidUKPostcode(form.postcode))
      errs.postcode = 'Please enter a valid UK postcode.';
    if (!form.installDate) errs.installDate = 'Please select an estimated installation date.';
    setErrors(errs);

    /* Scroll to first error */
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      const ref = firstKey === 'products' ? sectionRefs.products : sectionRefs.details;
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return Object.keys(errs).length === 0;
  };

  /* ── Submission ── */
  const handleSubmit = (e) => {
    e.preventDefault();

    /* Honeypot check */
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!validate()) return;

    const payload = {
      selectedProducts: selectedIds.map((id) => {
        const p = products.find((pr) => pr.id === id);
        return { id: p.id, slug: p.slug, name: p.name, material: p.material };
      }),
      wantSamples,
      kitchenPlan: {
        mode: planMode,
        dimensions: planMode === 'dimensions' ? worktopRuns : null,
        fileName: planMode === 'upload' && uploadedFile ? uploadedFile.name : null,
      },
      contact: { ...form },
    };

    /* TODO: POST /api/quotes with FormData (include uploadedFile if present) */
    console.log('Quote request:', payload);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Confirmation View ── */
  if (submitted) {
    return (
      <div className="quote-page">
        <section className="quote-page__hero">
          <div className="container">
            <h1 className="quote-page__hero-title">Thank You!</h1>
          </div>
        </section>

        <section className="section quote-page__confirmation">
          <div className="container">
            <div className="quote-page__confirmation-inner">
              <div className="quote-page__confirmation-icon" aria-hidden="true">
                <FiCheck />
              </div>
              <h2 className="quote-page__confirmation-heading">
                {form.firstName
                  ? `Thank you, ${form.firstName}!`
                  : 'Thank you!'}
              </h2>
              <p className="quote-page__confirmation-text">
                Your quote request has been received. Our team will prepare a
                personalised quote and send it to{' '}
                <strong>{form.email || 'your email'}</strong> within 24 hours.
              </p>
              {wantSamples && (
                <p className="quote-page__confirmation-text">
                  Your free samples will be posted within 2&ndash;3 working days.
                </p>
              )}
              <div className="quote-page__confirmation-actions">
                <Link to="/" className="btn btn--primary btn--lg">
                  Back to Home
                </Link>
                <Link to="/colours" className="btn btn--outline btn--lg">
                  Browse More Colours
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ── Main Form View ── */
  return (
    <div className="quote-page">
      {/* ── Hero ── */}
      <section className="quote-page__hero">
        <div className="container">
          <h1 className="quote-page__hero-title">
            Request a Quote &amp; Free Samples
          </h1>
          <p className="quote-page__hero-subtitle">
            You&rsquo;re one step closer to your dream kitchen. Choose your
            surfaces, tell us about your kitchen, and we&rsquo;ll prepare a
            personalised quote within 24 hours.
          </p>
        </div>
      </section>

      <form className="quote-page__form" onSubmit={handleSubmit} noValidate>
        {/* ════════════════════════════════════════
            Step 1 – Choose Your Material
           ════════════════════════════════════════ */}
        <section
          className="section quote-page__section"
          id="choose-material"
          ref={sectionRefs.products}
        >
          <div className="container">
            <div className="quote-page__section-header">
              <span className="quote-page__step-number">1</span>
              <div>
                <h2 className="quote-page__section-title">
                  Choose Your Material
                </h2>
                <p className="quote-page__section-desc">
                  Select up to three colours. Don&rsquo;t worry if you&rsquo;re
                  undecided &mdash; you can change colours or request more
                  samples later.
                </p>
              </div>
            </div>

            {errors.products && (
              <p className="quote-page__error quote-page__error--section" role="alert">
                {errors.products}
              </p>
            )}

            {selectionWarning && (
              <div className="quote-page__max-warning" role="alert">
                Maximum {MAX_COLOURS} colours. Deselect one to choose another.
              </div>
            )}

            {/* Swatch Grid */}
            <div className="quote-page__swatch-grid">
              {products.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`quote-page__swatch-tile${
                      isSelected ? ' quote-page__swatch-tile--selected' : ''
                    }`}
                    onClick={() => toggleProduct(p.id)}
                    aria-pressed={isSelected}
                    aria-label={`${p.name} – ${p.material}${
                      isSelected ? ' (selected)' : ''
                    }`}
                  >
                    <img
                      src={p.swatch}
                      alt={p.name}
                      className="quote-page__swatch-image"
                      loading="lazy"
                    />
                    <div className="quote-page__swatch-info">
                      <span className="quote-page__swatch-name">{p.name}</span>
                      <span className="quote-page__swatch-material">
                        {p.material}
                      </span>
                    </div>
                    <span
                      className="quote-page__swatch-check"
                      aria-hidden="true"
                    >
                      <FiCheck />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sample Toggle */}
            <div className="quote-page__sample-section">
              <p className="quote-page__sample-question">
                Would you like us to post free samples of your chosen colours?
              </p>
              <div className="quote-page__sample-toggle">
                <button
                  type="button"
                  className={`quote-page__toggle-btn${
                    wantSamples === true
                      ? ' quote-page__toggle-btn--active'
                      : ''
                  }`}
                  onClick={() => setWantSamples(true)}
                  aria-pressed={wantSamples === true}
                >
                  Yes, send me samples
                </button>
                <button
                  type="button"
                  className={`quote-page__toggle-btn${
                    wantSamples === false
                      ? ' quote-page__toggle-btn--active'
                      : ''
                  }`}
                  onClick={() => setWantSamples(false)}
                  aria-pressed={wantSamples === false}
                >
                  No thanks
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            Step 2 – Kitchen Plan
           ════════════════════════════════════════ */}
        <section
          className="section section--cream quote-page__section"
          id="kitchen-plan"
        >
          <div className="container">
            <div className="quote-page__section-header">
              <span className="quote-page__step-number">2</span>
              <div>
                <h2 className="quote-page__section-title">
                  Your Kitchen Plan
                </h2>
                <p className="quote-page__section-desc">
                  Help us understand your kitchen layout. You can enter
                  measurements manually or upload a plan. This step is optional
                  &mdash; we can arrange a free template visit later.
                </p>
              </div>
            </div>

            {/* Mode Selection Cards */}
            <div className="quote-page__plan-cards">
              <button
                type="button"
                className={`quote-page__plan-card${
                  planMode === 'dimensions'
                    ? ' quote-page__plan-card--active'
                    : ''
                }`}
                onClick={() =>
                  setPlanMode(planMode === 'dimensions' ? null : 'dimensions')
                }
                aria-pressed={planMode === 'dimensions'}
              >
                <span className="quote-page__plan-card-icon" aria-hidden="true">
                  &#x1F4D0;
                </span>
                <span className="quote-page__plan-card-title">
                  Enter Dimensions
                </span>
                <span className="quote-page__plan-card-desc">
                  Add the length and width for each worktop run
                </span>
              </button>

              <button
                type="button"
                className={`quote-page__plan-card${
                  planMode === 'upload' ? ' quote-page__plan-card--active' : ''
                }`}
                onClick={() =>
                  setPlanMode(planMode === 'upload' ? null : 'upload')
                }
                aria-pressed={planMode === 'upload'}
              >
                <FiUploadCloud className="quote-page__plan-card-fi-icon" />
                <span className="quote-page__plan-card-title">
                  Upload Plan
                </span>
                <span className="quote-page__plan-card-desc">
                  Upload a PDF or image of your kitchen layout
                </span>
              </button>
            </div>

            {/* Dimensions Sub-form */}
            {planMode === 'dimensions' && (
              <div className="quote-page__dimensions">
                {worktopRuns.map((run, index) => (
                  <div key={index} className="quote-page__run-row">
                    <span className="quote-page__run-label">
                      Run {index + 1}
                    </span>
                    <div className="quote-page__run-field">
                      <label
                        htmlFor={`run-length-${index}`}
                        className="quote-page__run-field-label"
                      >
                        Length (mm)
                      </label>
                      <input
                        id={`run-length-${index}`}
                        type="number"
                        className="quote-page__input"
                        placeholder="e.g. 3000"
                        value={run.length}
                        onChange={(e) =>
                          updateRun(index, 'length', e.target.value)
                        }
                        min="0"
                      />
                    </div>
                    <div className="quote-page__run-field">
                      <label
                        htmlFor={`run-width-${index}`}
                        className="quote-page__run-field-label"
                      >
                        Width (mm)
                      </label>
                      <input
                        id={`run-width-${index}`}
                        type="number"
                        className="quote-page__input"
                        placeholder="e.g. 600"
                        value={run.width}
                        onChange={(e) =>
                          updateRun(index, 'width', e.target.value)
                        }
                        min="0"
                      />
                    </div>
                    {worktopRuns.length > 1 && (
                      <button
                        type="button"
                        className="quote-page__run-remove"
                        onClick={() => removeRun(index)}
                        aria-label={`Remove run ${index + 1}`}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}

                {worktopRuns.length < 5 && (
                  <button
                    type="button"
                    className="quote-page__add-run"
                    onClick={addRun}
                  >
                    <FiPlus /> Add another worktop run
                  </button>
                )}
              </div>
            )}

            {/* Upload Sub-form */}
            {planMode === 'upload' && (
              <div className="quote-page__upload">
                <div
                  className={`quote-page__dropzone${
                    dragOver ? ' quote-page__dropzone--over' : ''
                  }${uploadedFile ? ' quote-page__dropzone--uploaded' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload kitchen plan file"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    className="quote-page__file-input"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  {uploadedFile ? (
                    <>
                      <FiCheck className="quote-page__dropzone-icon quote-page__dropzone-icon--done" />
                      <span className="quote-page__dropzone-filename">
                        {uploadedFile.name}
                      </span>
                      <span className="quote-page__dropzone-hint">
                        Click or drop to replace
                      </span>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="quote-page__dropzone-icon" />
                      <span className="quote-page__dropzone-text">
                        Drag &amp; drop your file here, or click to browse
                      </span>
                      <span className="quote-page__dropzone-hint">
                        JPG, PNG or PDF &mdash; max 10 MB
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════
            Step 3 – Your Details
           ════════════════════════════════════════ */}
        <section
          className="section quote-page__section"
          id="your-details"
          ref={sectionRefs.details}
        >
          <div className="container">
            <div className="quote-page__section-header">
              <span className="quote-page__step-number">3</span>
              <div>
                <h2 className="quote-page__section-title">Your Details</h2>
                <p className="quote-page__section-desc">
                  We&rsquo;ll use these details to prepare and send your quote.
                </p>
              </div>
            </div>

            <div className="quote-page__details-form">
              {/* First / Last Name */}
              <div className="quote-page__row">
                <div className="quote-page__group">
                  <label htmlFor="qp-firstName" className="quote-page__label">
                    First Name <span className="quote-page__required">*</span>
                  </label>
                  <input
                    id="qp-firstName"
                    name="firstName"
                    type="text"
                    className={`quote-page__input${
                      errors.firstName ? ' quote-page__input--error' : ''
                    }`}
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <span className="quote-page__error">{errors.firstName}</span>
                  )}
                </div>
                <div className="quote-page__group">
                  <label htmlFor="qp-lastName" className="quote-page__label">
                    Last Name <span className="quote-page__required">*</span>
                  </label>
                  <input
                    id="qp-lastName"
                    name="lastName"
                    type="text"
                    className={`quote-page__input${
                      errors.lastName ? ' quote-page__input--error' : ''
                    }`}
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <span className="quote-page__error">{errors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="quote-page__group">
                <label htmlFor="qp-email" className="quote-page__label">
                  Email Address <span className="quote-page__required">*</span>
                </label>
                <input
                  id="qp-email"
                  name="email"
                  type="email"
                  className={`quote-page__input${
                    errors.email ? ' quote-page__input--error' : ''
                  }`}
                  placeholder="you@example.co.uk"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="quote-page__error">{errors.email}</span>
                )}
              </div>

              {/* Phone / Postcode */}
              <div className="quote-page__row">
                <div className="quote-page__group">
                  <label htmlFor="qp-phone" className="quote-page__label">
                    Phone <span className="quote-page__required">*</span>
                  </label>
                  <input
                    id="qp-phone"
                    name="phone"
                    type="tel"
                    className={`quote-page__input${
                      errors.phone ? ' quote-page__input--error' : ''
                    }`}
                    placeholder="07700 123 456"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <span className="quote-page__error">{errors.phone}</span>
                  )}
                </div>
                <div className="quote-page__group">
                  <label htmlFor="qp-postcode" className="quote-page__label">
                    Postcode <span className="quote-page__required">*</span>
                  </label>
                  <input
                    id="qp-postcode"
                    name="postcode"
                    type="text"
                    className={`quote-page__input${
                      errors.postcode ? ' quote-page__input--error' : ''
                    }`}
                    placeholder="SW1A 1AA"
                    value={form.postcode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                  />
                  {errors.postcode && (
                    <span className="quote-page__error">{errors.postcode}</span>
                  )}
                  <span className="quote-page__helper">
                    Required so we can calculate template, delivery and
                    installation costs.
                  </span>
                </div>
              </div>

              {/* Installation Date */}
              <div className="quote-page__group">
                <label htmlFor="qp-installDate" className="quote-page__label">
                  Estimated Kitchen Installation Date{' '}
                  <span className="quote-page__required">*</span>
                </label>
                <input
                  id="qp-installDate"
                  name="installDate"
                  type="date"
                  className={`quote-page__input${
                    errors.installDate ? ' quote-page__input--error' : ''
                  }`}
                  value={form.installDate}
                  onChange={handleChange}
                />
                {errors.installDate && (
                  <span className="quote-page__error">
                    {errors.installDate}
                  </span>
                )}
                <span className="quote-page__helper">
                  Please provide an estimated date for when your cabinetry will
                  be installed. We schedule templating and installation after
                  this date.
                </span>
              </div>

              {/* Honeypot */}
              <div className="quote-page__hp" aria-hidden="true">
                <label htmlFor="qp-company-website">Company Website</label>
                <input
                  id="qp-company-website"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Privacy Notice */}
              <p className="quote-page__privacy">
                The contact information you provide will be used to send you
                quotes, special offers and updates via email. You can
                unsubscribe at any time. See our{' '}
                <Link to="/privacy">Privacy Policy</Link> for details.
              </p>

              {/* Submit */}
              <button type="submit" className="btn btn--gold btn--lg quote-page__submit">
                Submit Quote Request
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
