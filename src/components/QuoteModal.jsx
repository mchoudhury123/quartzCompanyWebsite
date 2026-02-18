import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiX, FiUploadCloud, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import products from '../data/products.json';
import './QuoteModal.css';

/**
 * QuoteModal – Multi-step quote / sample request modal for The Quartz Company.
 *
 * Props:
 *   product  – optional product object to pre-fill step 1
 *   onClose  – callback to close the modal
 */

const STEP_LABELS = ['Your Worktop', 'Your Details', 'Confirmation'];

const THICKNESS_OPTIONS = ['20mm', '30mm'];

const CALLBACK_TIMES = [
  'Morning (9 am – 12 pm)',
  'Afternoon (12 pm – 3 pm)',
  'Late afternoon (3 pm – 6 pm)',
  'Evening (6 pm – 8 pm)',
  'No preference',
];

/* Validation helpers */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidUKPostcode = (pc) =>
  /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(pc.trim());

function QuoteModal({ product = null, onClose }) {
  const [step, setStep] = useState(1);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ── Step 1 state ── */
  const [selectedProductId, setSelectedProductId] = useState(
    product ? String(product.id) : ''
  );
  const [runLength, setRunLength] = useState('');
  const [depth, setDepth] = useState('');
  const [thickness, setThickness] = useState(THICKNESS_OPTIONS[0]);
  const [cutOutHob, setCutOutHob] = useState(0);
  const [cutOutSink, setCutOutSink] = useState(0);
  const [cutOutTap, setCutOutTap] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [comments, setComments] = useState('');

  /* ── Step 2 state ── */
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [wantSamples, setWantSamples] = useState(false);
  const [wantCallback, setWantCallback] = useState(false);
  const [callbackTime, setCallbackTime] = useState(CALLBACK_TIMES[4]);

  /* ── Honeypot (spam protection) ── */
  const [honeypot, setHoneypot] = useState('');

  /* ── Validation errors ── */
  const [errors, setErrors] = useState({});

  /* ── Prevent body scroll ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* ── Close on Escape key ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  /* ── Focus trap: keep focus inside modal ── */
  useEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    const focusable = node.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }, [step]);

  /* ── Overlay click to close ── */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  /* ── Resolve selected product ── */
  const selectedProduct =
    products.find((p) => String(p.id) === selectedProductId) || null;

  /* ── File handling ── */
  const handleFileSelect = (file) => {
    if (!file) return;
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, file: 'File must be under 10 MB.' }));
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });
    setUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  /* ── Validation ── */
  const validateStep1 = () => {
    const errs = {};
    if (!selectedProductId) errs.product = 'Please select a product.';
    if (!runLength || Number(runLength) <= 0)
      errs.runLength = 'Please enter a valid run length (mm).';
    if (!depth || Number(depth) <= 0)
      errs.depth = 'Please enter a valid depth (mm).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Name is required.';
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!isValidEmail(email)) errs.email = 'Please enter a valid email address.';
    if (!phone.trim()) errs.phone = 'Phone number is required.';
    if (!postcode.trim()) errs.postcode = 'Postcode is required.';
    else if (!isValidUKPostcode(postcode))
      errs.postcode = 'Please enter a valid UK postcode.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Navigation ── */
  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    // If honeypot filled, silently "succeed" without actually submitting
    if (step === 2 && honeypot) {
      setStep(3);
      return;
    }

    if (step === 2) {
      // Simulate form submission
      // In production you would POST to your API here
      console.log('Quote request submitted:', {
        product: selectedProduct?.name,
        runLength,
        depth,
        thickness,
        cutOuts: { hob: cutOutHob, sink: cutOutSink, tap: cutOutTap },
        file: uploadedFile?.name || null,
        comments,
        fullName,
        email,
        phone,
        postcode,
        wantSamples,
        wantCallback,
        callbackTime: wantCallback ? callbackTime : null,
      });
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  /* ── Helpers ── */
  const fieldClass = (fieldName) =>
    errors[fieldName] ? 'quote-modal__input quote-modal__input--error' : 'quote-modal__input';

  const renderError = (fieldName) =>
    errors[fieldName] ? (
      <span className="quote-modal__field-error">{errors[fieldName]}</span>
    ) : null;

  /* ── Format price helper ── */
  const formatPrice = (value) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="quote-modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Request a quote">
      <div className="quote-modal" ref={modalRef}>
        {/* Close button */}
        <button
          type="button"
          className="quote-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FiX />
        </button>

        {/* ── Progress indicator ── */}
        <div className="quote-modal__progress" aria-label={`Step ${step} of 3`}>
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <React.Fragment key={label}>
                {i > 0 && (
                  <div
                    className={`quote-modal__progress-line${
                      isCompleted || isCurrent ? ' quote-modal__progress-line--active' : ''
                    }`}
                  />
                )}
                <div className="quote-modal__progress-step">
                  <div
                    className={`quote-modal__progress-circle${
                      isCompleted
                        ? ' quote-modal__progress-circle--completed'
                        : isCurrent
                        ? ' quote-modal__progress-circle--current'
                        : ''
                    }`}
                  >
                    {isCompleted ? <FiCheck /> : stepNum}
                  </div>
                  <span
                    className={`quote-modal__progress-label${
                      isCurrent ? ' quote-modal__progress-label--current' : ''
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Step content ── */}
        <div className="quote-modal__content">
          {/* ──────────────────────── STEP 1 ──────────────────────── */}
          {step === 1 && (
            <div className="quote-modal__step quote-modal__step--enter">
              <h2 className="quote-modal__heading">Your Worktop</h2>
              <p className="quote-modal__intro">
                Tell us about the worktop you are interested in. We will prepare a
                personalised quote within 24 hours.
              </p>

              {/* Product selector */}
              <div className="quote-modal__field">
                <label className="quote-modal__label" htmlFor="qm-product">
                  Product <span className="quote-modal__required">*</span>
                </label>
                {product ? (
                  <div className="quote-modal__selected-product">
                    <img
                      src={product.swatch}
                      alt={product.name}
                      className="quote-modal__selected-product-swatch"
                    />
                    <div>
                      <strong>{product.name}</strong>
                      <span className="quote-modal__selected-product-info">
                        {product.material} &mdash; {product.collection}
                      </span>
                      {product.onSale ? (
                        <span className="quote-modal__selected-product-price">
                          {formatPrice(product.pricePerSqm)} /m&sup2;
                        </span>
                      ) : (
                        <span className="quote-modal__selected-product-price">
                          {formatPrice(product.pricePerSqm)} /m&sup2;
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <select
                      id="qm-product"
                      className={fieldClass('product')}
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      <option value="">-- Select a product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                          {p.name} ({p.material} &mdash; {formatPrice(p.pricePerSqm)} /m&sup2;)
                        </option>
                      ))}
                    </select>
                    {renderError('product')}
                  </>
                )}
              </div>

              {/* Measurements */}
              <fieldset className="quote-modal__fieldset">
                <legend className="quote-modal__legend">Approximate Measurements</legend>

                <div className="quote-modal__row">
                  <div className="quote-modal__field quote-modal__field--half">
                    <label className="quote-modal__label" htmlFor="qm-run">
                      Run Length (mm) <span className="quote-modal__required">*</span>
                    </label>
                    <input
                      id="qm-run"
                      type="number"
                      min="0"
                      step="1"
                      className={fieldClass('runLength')}
                      placeholder="e.g. 3000"
                      value={runLength}
                      onChange={(e) => setRunLength(e.target.value)}
                    />
                    {renderError('runLength')}
                  </div>

                  <div className="quote-modal__field quote-modal__field--half">
                    <label className="quote-modal__label" htmlFor="qm-depth">
                      Depth (mm) <span className="quote-modal__required">*</span>
                    </label>
                    <input
                      id="qm-depth"
                      type="number"
                      min="0"
                      step="1"
                      className={fieldClass('depth')}
                      placeholder="e.g. 600"
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                    />
                    {renderError('depth')}
                  </div>
                </div>

                <div className="quote-modal__field">
                  <label className="quote-modal__label" htmlFor="qm-thickness">
                    Thickness
                  </label>
                  <select
                    id="qm-thickness"
                    className="quote-modal__input"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                  >
                    {THICKNESS_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>

              {/* Cut-outs */}
              <fieldset className="quote-modal__fieldset">
                <legend className="quote-modal__legend">Number of Cut-Outs</legend>
                <div className="quote-modal__row quote-modal__row--thirds">
                  <div className="quote-modal__field">
                    <label className="quote-modal__label" htmlFor="qm-hob">Hob</label>
                    <input
                      id="qm-hob"
                      type="number"
                      min="0"
                      max="5"
                      className="quote-modal__input"
                      value={cutOutHob}
                      onChange={(e) => setCutOutHob(Number(e.target.value))}
                    />
                  </div>
                  <div className="quote-modal__field">
                    <label className="quote-modal__label" htmlFor="qm-sink">Sink</label>
                    <input
                      id="qm-sink"
                      type="number"
                      min="0"
                      max="5"
                      className="quote-modal__input"
                      value={cutOutSink}
                      onChange={(e) => setCutOutSink(Number(e.target.value))}
                    />
                  </div>
                  <div className="quote-modal__field">
                    <label className="quote-modal__label" htmlFor="qm-tap">Tap Holes</label>
                    <input
                      id="qm-tap"
                      type="number"
                      min="0"
                      max="10"
                      className="quote-modal__input"
                      value={cutOutTap}
                      onChange={(e) => setCutOutTap(Number(e.target.value))}
                    />
                  </div>
                </div>
              </fieldset>

              {/* File upload – drag & drop */}
              <div className="quote-modal__field">
                <label className="quote-modal__label">Kitchen Plan (optional)</label>
                <div
                  className={`quote-modal__dropzone${dragOver ? ' quote-modal__dropzone--active' : ''}${
                    uploadedFile ? ' quote-modal__dropzone--has-file' : ''
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                  }}
                  aria-label="Upload kitchen plan"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="quote-modal__file-input"
                    accept=".jpg,.jpeg,.png,.pdf,.dwg"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    tabIndex={-1}
                  />
                  {uploadedFile ? (
                    <div className="quote-modal__dropzone-uploaded">
                      <FiCheck className="quote-modal__dropzone-icon quote-modal__dropzone-icon--success" />
                      <span>{uploadedFile.name}</span>
                      <button
                        type="button"
                        className="quote-modal__dropzone-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        aria-label="Remove file"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className="quote-modal__dropzone-prompt">
                      <FiUploadCloud className="quote-modal__dropzone-icon" />
                      <span>Drag &amp; drop your kitchen plan here</span>
                      <span className="quote-modal__dropzone-hint">
                        or click to browse &middot; JPG, PNG, PDF, DWG &middot; Max 10 MB
                      </span>
                    </div>
                  )}
                </div>
                {renderError('file')}
              </div>

              {/* Comments */}
              <div className="quote-modal__field">
                <label className="quote-modal__label" htmlFor="qm-comments">
                  Additional Comments (optional)
                </label>
                <textarea
                  id="qm-comments"
                  className="quote-modal__input quote-modal__textarea"
                  rows="3"
                  placeholder="Any special requirements, edge profiles, splashbacks..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ──────────────────────── STEP 2 ──────────────────────── */}
          {step === 2 && (
            <div className="quote-modal__step quote-modal__step--enter">
              <h2 className="quote-modal__heading">Your Details</h2>
              <p className="quote-modal__intro">
                Let us know how to reach you and we will be in touch within 24 hours.
              </p>

              {/* Honeypot – hidden from real users */}
              <div className="quote-modal__hp" aria-hidden="true">
                <label htmlFor="qm-company-website">Website</label>
                <input
                  id="qm-company-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="quote-modal__field">
                <label className="quote-modal__label" htmlFor="qm-name">
                  Full Name <span className="quote-modal__required">*</span>
                </label>
                <input
                  id="qm-name"
                  type="text"
                  className={fieldClass('fullName')}
                  placeholder="e.g. James Wilson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
                {renderError('fullName')}
              </div>

              <div className="quote-modal__field">
                <label className="quote-modal__label" htmlFor="qm-email">
                  Email Address <span className="quote-modal__required">*</span>
                </label>
                <input
                  id="qm-email"
                  type="email"
                  className={fieldClass('email')}
                  placeholder="e.g. james@example.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {renderError('email')}
              </div>

              <div className="quote-modal__row">
                <div className="quote-modal__field quote-modal__field--half">
                  <label className="quote-modal__label" htmlFor="qm-phone">
                    Phone <span className="quote-modal__required">*</span>
                  </label>
                  <input
                    id="qm-phone"
                    type="tel"
                    className={fieldClass('phone')}
                    placeholder="e.g. 07700 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                  {renderError('phone')}
                </div>

                <div className="quote-modal__field quote-modal__field--half">
                  <label className="quote-modal__label" htmlFor="qm-postcode">
                    Postcode <span className="quote-modal__required">*</span>
                  </label>
                  <input
                    id="qm-postcode"
                    type="text"
                    className={fieldClass('postcode')}
                    placeholder="e.g. SW1A 1AA"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    autoComplete="postal-code"
                  />
                  {renderError('postcode')}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="quote-modal__checkboxes">
                <label className="quote-modal__checkbox-label">
                  <input
                    type="checkbox"
                    checked={wantSamples}
                    onChange={(e) => setWantSamples(e.target.checked)}
                    className="quote-modal__checkbox"
                  />
                  <span className="quote-modal__checkbox-custom" />
                  I'd like free samples posted to me
                </label>

                <label className="quote-modal__checkbox-label">
                  <input
                    type="checkbox"
                    checked={wantCallback}
                    onChange={(e) => setWantCallback(e.target.checked)}
                    className="quote-modal__checkbox"
                  />
                  <span className="quote-modal__checkbox-custom" />
                  Book a design callback
                </label>
              </div>

              {/* Callback time – shown conditionally */}
              {wantCallback && (
                <div className="quote-modal__field quote-modal__field--callback">
                  <label className="quote-modal__label" htmlFor="qm-callback-time">
                    Preferred Callback Time
                  </label>
                  <select
                    id="qm-callback-time"
                    className="quote-modal__input"
                    value={callbackTime}
                    onChange={(e) => setCallbackTime(e.target.value)}
                  >
                    {CALLBACK_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* ──────────────────────── STEP 3 ──────────────────────── */}
          {step === 3 && (
            <div className="quote-modal__step quote-modal__step--enter">
              <div className="quote-modal__confirmation">
                <div className="quote-modal__confirmation-icon">
                  <FiCheck />
                </div>
                <h2 className="quote-modal__heading">Thank You, {fullName.split(' ')[0]}!</h2>
                <p className="quote-modal__confirmation-text">
                  Your request has been received. A designer will contact you within
                  <strong> 24 hours</strong>.
                  {wantSamples && (
                    <> Free samples will be posted within <strong>2 working days</strong>.</>
                  )}
                </p>
              </div>

              {/* Summary */}
              <div className="quote-modal__summary">
                <h3 className="quote-modal__summary-title">Request Summary</h3>

                <div className="quote-modal__summary-section">
                  <h4 className="quote-modal__summary-heading">Worktop</h4>
                  <dl className="quote-modal__summary-list">
                    <dt>Product</dt>
                    <dd>{selectedProduct?.name || '—'}</dd>
                    <dt>Material</dt>
                    <dd>{selectedProduct?.material || '—'}</dd>
                    <dt>Dimensions</dt>
                    <dd>{runLength} mm &times; {depth} mm &times; {thickness}</dd>
                    <dt>Cut-outs</dt>
                    <dd>
                      {cutOutHob > 0 && `${cutOutHob} hob`}
                      {cutOutHob > 0 && (cutOutSink > 0 || cutOutTap > 0) && ', '}
                      {cutOutSink > 0 && `${cutOutSink} sink`}
                      {cutOutSink > 0 && cutOutTap > 0 && ', '}
                      {cutOutTap > 0 && `${cutOutTap} tap hole${cutOutTap > 1 ? 's' : ''}`}
                      {cutOutHob === 0 && cutOutSink === 0 && cutOutTap === 0 && 'None'}
                    </dd>
                    {uploadedFile && (
                      <>
                        <dt>Kitchen Plan</dt>
                        <dd>{uploadedFile.name}</dd>
                      </>
                    )}
                    {comments && (
                      <>
                        <dt>Comments</dt>
                        <dd>{comments}</dd>
                      </>
                    )}
                  </dl>
                </div>

                <div className="quote-modal__summary-section">
                  <h4 className="quote-modal__summary-heading">Contact</h4>
                  <dl className="quote-modal__summary-list">
                    <dt>Name</dt>
                    <dd>{fullName}</dd>
                    <dt>Email</dt>
                    <dd>{email}</dd>
                    <dt>Phone</dt>
                    <dd>{phone}</dd>
                    <dt>Postcode</dt>
                    <dd>{postcode}</dd>
                    {wantSamples && (
                      <>
                        <dt>Free Samples</dt>
                        <dd>Yes &mdash; posting to {postcode.toUpperCase()}</dd>
                      </>
                    )}
                    {wantCallback && (
                      <>
                        <dt>Design Callback</dt>
                        <dd>Yes &mdash; {callbackTime}</dd>
                      </>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation buttons ── */}
        <div className="quote-modal__nav">
          {step === 1 && <div />}
          {step === 2 && (
            <button type="button" className="btn btn--outline quote-modal__btn-back" onClick={goBack}>
              <FiChevronLeft /> Back
            </button>
          )}
          {step === 3 && <div />}

          {step < 3 && (
            <button type="button" className="btn btn--primary quote-modal__btn-next" onClick={goNext}>
              {step === 2 ? 'Submit Request' : 'Next'} <FiChevronRight />
            </button>
          )}
          {step === 3 && (
            <button type="button" className="btn btn--primary quote-modal__btn-close" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuoteModal;
