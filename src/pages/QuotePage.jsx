import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiCheck,
  FiUploadCloud,
  FiX,
  FiPlus,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import usePageMeta from '../hooks/usePageMeta';
import products from '../data/products.json';
import { supabase } from '../lib/supabase';
import { logActivity } from '../admin/utils/activityLogger';
import { trackLead, trackQuoteStep } from '../lib/metaTracking';
import './QuotePage.css';

/* Validation helpers */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidUKPostcode = (pc) =>
  /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(pc.trim());

/* Render a 5-star rating row (filled/empty) */
const renderStars = (count) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        className={
          i < count
            ? 'quote-page__trust-star--filled'
            : 'quote-page__trust-star--empty'
        }
      >
        {i < count ? '★' : '☆'}
      </span>
    );
  }
  return stars;
};

/* Reviews shown in the quote-page carousel.
   NOTE: placeholder copy — replace with genuine customer reviews
   (e.g. exported from Google) before relying on these. */
const QUOTE_REVIEWS = [
  {
    id: 'r1',
    name: 'Rebecca H.',
    location: 'Rugby',
    rating: 5,
    text: 'Faultless from start to finish — our worktops are absolutely stunning.',
  },
  {
    id: 'r2',
    name: 'Mark Sanders',
    location: 'Leicester',
    rating: 5,
    text: 'From the first phone call to the final polish, the team were exceptional. The templating was spot on, the fitters were tidy and professional, and our island is now the centrepiece of the whole kitchen. I couldn’t recommend them more highly.',
  },
  {
    id: 'r3',
    name: 'Priya & Anil',
    location: 'Loughborough',
    rating: 5,
    text: 'We agonised over colours for weeks, but the samples made it easy. The finish is flawless and looks even better than we imagined.',
  },
  {
    id: 'r4',
    name: 'Gemma W.',
    location: 'Market Harborough',
    rating: 5,
    text: 'Beautiful quartz, brilliant service, worth every penny.',
  },
  {
    id: 'r5',
    name: 'Jonathan Reeve',
    location: 'Oakham',
    rating: 5,
    text: 'I’ve had kitchens fitted before and nothing came close to this. Communication was superb throughout, the quote was clear with no surprises, and the quality of the stone is exceptional. A genuinely first-class company from enquiry to installation.',
  },
  {
    id: 'r6',
    name: 'Claire T.',
    location: 'Bedford',
    rating: 4,
    text: 'Professional, friendly and meticulous. Our new worktops have completely transformed the room.',
  },
];

const MAX_COLOURS = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.pdf';

const STEPS = [
  { number: 1, label: 'Choose Material', id: 'choose-material' },
  { number: 2, label: 'Kitchen Plan', id: 'kitchen-plan' },
  { number: 3, label: 'Your Details', id: 'your-details' },
];

export default function QuotePage() {
  usePageMeta('Get a Free Quote | Quartz Kitchen Worktops | The Quartz Company', 'Request a free, fixed-price quote for premium engineered or printed quartz kitchen worktops. Fast same-day pricing, free samples and expert fitting across the Midlands.');
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
  const [undecided, setUndecided] = useState(false);

  /* ── Step 2: Kitchen Plan ── */
  const [planMode, setPlanMode] = useState(null);
  const [worktopRuns, setWorktopRuns] = useState([{ length: '', width: '' }]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  /* ── Step 3: Your Details ── */
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postcode: '',
  });
  const [honeypot, setHoneypot] = useState('');

  /* ── Validation & Submission ── */
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* ── Reviews carousel ── */
  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewCount = QUOTE_REVIEWS.length;
  const nextReview = () => setReviewIndex((i) => (i + 1) % reviewCount);
  const prevReview = () =>
    setReviewIndex((i) => (i - 1 + reviewCount) % reviewCount);
  const activeReview = QUOTE_REVIEWS[reviewIndex];

  /* ── Active step tracking (IntersectionObserver) ── */
  const [activeStep, setActiveStep] = useState(1);
  const stepRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
  };

  useEffect(() => {
    const sections = [
      { ref: stepRefs[1], step: 1 },
      { ref: stepRefs[2], step: 2 },
      { ref: stepRefs[3], step: 3 },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        /* Find the entry with the largest intersection ratio */
        let bestEntry = null;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        });

        if (bestEntry) {
          const match = sections.find(
            (s) => s.ref.current === bestEntry.target
          );
          if (match) setActiveStep(match.step);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Meta: QuoteStep1/2/3 analytics, each fired once as the visitor
     progresses through the quote funnel ── */
  const firedSteps = useRef(new Set());
  useEffect(() => {
    if (firedSteps.current.has(activeStep)) return;
    firedSteps.current.add(activeStep);
    trackQuoteStep(activeStep);
  }, [activeStep]);

  /* Refs for scroll-to-error */
  const sectionRefs = {
    products: stepRefs[1],
    details: stepRefs[3],
  };

  /* ── Handlers: Step 1 ── */
  const scrollToKitchenPlan = () => {
    stepRefs[2].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleProduct = (id) => {
    /* Picking a real colour clears the "undecided" choice */
    setUndecided(false);

    const alreadySelected = selectedIds.includes(id);
    if (!alreadySelected && selectedIds.length >= MAX_COLOURS) {
      setSelectionWarning(true);
      setTimeout(() => setSelectionWarning(false), 3000);
      return;
    }

    const next = alreadySelected
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setSelectedIds(next);

    /* Reaching the max of three colours advances to the kitchen plan */
    if (next.length === MAX_COLOURS) scrollToKitchenPlan();

    if (errors.products) setErrors((prev) => ({ ...prev, products: '' }));
  };

  const handleUndecided = () => {
    setUndecided(true);
    setSelectedIds([]);
    if (errors.products) setErrors((prev) => ({ ...prev, products: '' }));
    scrollToKitchenPlan();
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

  const handleFileSelect = useCallback((fileList) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    const tooBig = incoming.filter((f) => f.size > MAX_FILE_SIZE);
    if (tooBig.length > 0) {
      alert(
        `${tooBig.map((f) => f.name).join(', ')} ${
          tooBig.length > 1 ? 'are each' : 'is'
        } over 10 MB and ${tooBig.length > 1 ? "weren't" : "wasn't"} added.`
      );
    }
    const valid = incoming.filter((f) => f.size <= MAX_FILE_SIZE);
    if (valid.length === 0) return;

    setUploadedFiles((prev) => {
      const seen = new Set(prev.map((f) => `${f.name}_${f.size}`));
      const merged = [...prev];
      valid.forEach((f) => {
        if (!seen.has(`${f.name}_${f.size}`)) merged.push(f);
      });
      return merged;
    });
  }, []);

  const removeFile = useCallback((index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
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
    if (selectedIds.length === 0 && !undecided)
      errs.products = 'Please select at least one colour, or choose “Undecided”.';
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) errs.email = 'Email address is required.';
    else if (!isValidEmail(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    if (!form.postcode.trim()) errs.postcode = 'Postcode is required.';
    else if (!isValidUKPostcode(form.postcode))
      errs.postcode = 'Please enter a valid UK postcode.';
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Honeypot check */
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!validate()) return;

    const selectedProducts = selectedIds.map((id) => {
      const p = products.find((pr) => pr.id === id);
      return { id: p.id, slug: p.slug, name: p.name, material: p.material };
    });

    let leadSaved = false;
    try {
      const leadId = crypto.randomUUID();
      const { error: leadError } = await supabase.from('leads').insert({
        id: leadId,
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        postcode: form.postcode,
        source: 'quote_page',
        product_name: undecided
          ? 'Undecided'
          : selectedProducts.map((p) => p.name).join(', '),
        product_material: selectedProducts[0]?.material || null,
        want_samples: false,
        pending_action: 'call_new',
        comments: planMode === 'dimensions'
          ? `Worktop runs: ${worktopRuns.map((r, i) => `Run ${i + 1}: ${r.length}mm x ${r.width}mm`).join(', ')}`
          : null,
      });
      leadSaved = !leadError;

      // Upload kitchen plan files: for each, get a signed URL, upload, then record it.
      const uploadedFileNames = [];
      if (planMode === 'upload' && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            // Step 1: Get a signed upload URL from our API (also creates the file record)
            const urlRes = await fetch('/api/upload-file', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                leadId,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
              }),
            });
            const urlResult = await urlRes.json();

            if (!urlResult.success) {
              console.error('Failed to get upload URL:', urlResult.error);
              continue;
            }

            // Step 2: Upload the file using the Supabase SDK, which sends it
            // in the multipart form the storage server expects (a plain PUT of
            // the raw file can store an unreadable object).
            const { error: uploadError } = await supabase.storage
              .from('lead-files')
              .uploadToSignedUrl(urlResult.storagePath, urlResult.token, file, {
                contentType: file.type || 'application/octet-stream',
              });

            if (uploadError) {
              console.error('Direct upload failed:', uploadError.message);
              continue;
            }

            // Step 3: Only now that the file is really in storage, record it
            // in the database so the admin never sees a file they can't open.
            const { error: dbError } = await supabase.from('lead_files').insert({
              lead_id: leadId,
              file_name: file.name,
              file_type: file.type || 'application/octet-stream',
              file_size: file.size || 0,
              storage_path: urlResult.storagePath,
              category: 'plan',
              uploaded_by: 'Customer',
            });
            if (dbError) {
              console.error('File record insert failed:', dbError.message);
              continue;
            }

            uploadedFileNames.push(file.name);
          } catch (fileErr) {
            console.error('File upload error:', fileErr);
          }
        }
      }

      // Log enquiry summary in activity timeline
      const filledRuns = worktopRuns.filter((r) => r.length || r.width);
      await logActivity(leadId, {
        type: 'enquiry_received',
        title: 'Enquiry received',
        description: undecided
          ? 'Undecided (colour to be confirmed)'
          : selectedProducts.map((p) => p.name).join(', '),
        metadata: {
          source: 'quote_page',
          products: selectedProducts.map((p) => ({ name: p.name, material: p.material })),
          kitchen_plan: planMode === 'dimensions' && filledRuns.length > 0
            ? { worktop_runs: filledRuns }
            : null,
          kitchen_plan_uploaded: uploadedFileNames.length > 0,
          kitchen_plan_file: uploadedFileNames.join(', ') || null,
          kitchen_plan_files: uploadedFileNames,
          postcode: form.postcode,
        },
        author: 'Customer',
      });
    } catch (err) {
      console.error('Failed to submit quote:', err);
    }

    // Track the quote request as a conversion (Lead) — Pixel + CAPI, deduped.
    // Only fires after the lead was actually saved.
    if (leadSaved) {
      trackLead(
        {
          email: form.email,
          phone: form.phone,
          firstName: form.firstName,
          lastName: form.lastName,
          postcode: form.postcode,
        },
        {
          content_name: 'Quote Request',
          content_category: selectedProducts[0]?.material || undefined,
        }
      );
    }

    // Send the customer a branded confirmation so they know their request
    // landed — reassures them and cuts down on duplicate quote submissions
    // while they wait. Fire-and-forget so the thank-you screen isn't delayed;
    // the server wraps this plain text in the standard branded template.
    if (leadSaved && form.email) {
      const firstName = form.firstName ? form.firstName.trim() : '';
      fetch('/api/zoho-send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: form.email,
          subject: 'Thank you for your quote request — The Quartz Company',
          body: `${firstName ? `Hi ${firstName},` : 'Hello,'}\n\nThank you for requesting a quote with The Quartz Company. We've received your details and our team is already preparing a personalised, fixed-price quote for you.\n\nWe'll be in touch within 24 hours — there's no need to submit another request in the meantime.\n\nIf anything is urgent, simply reply to this email or call us on 07375 303 416 and we'll be happy to help.\n\nWarm regards,\nThe Quartz Company Team`,
          transactional: true,
        }),
      }).catch((err) => console.error('Quote confirmation email failed:', err));
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Scroll to step on progress bar click ── */
  const scrollToStep = (stepNumber) => {
    const ref = stepRefs[stepNumber];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

      {/* ── Progress Bar ── */}
      <nav className="quote-page__progress" aria-label="Quote form progress">
        <div className="container">
          <ol className="quote-page__progress-bar">
            {STEPS.map((step, index) => {
              const isActive = activeStep === step.number;
              const isCompleted = activeStep > step.number;
              return (
                <li
                  key={step.number}
                  className={`quote-page__progress-step${
                    isActive ? ' quote-page__progress-step--active' : ''
                  }${isCompleted ? ' quote-page__progress-step--completed' : ''}`}
                >
                  {/* Connecting line before (not on first step) */}
                  {index > 0 && (
                    <span
                      className={`quote-page__progress-line${
                        activeStep >= step.number
                          ? ' quote-page__progress-line--filled'
                          : ''
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  <button
                    type="button"
                    className="quote-page__progress-btn"
                    onClick={() => scrollToStep(step.number)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`Step ${step.number}: ${step.label}${
                      isActive ? ' (current)' : ''
                    }${isCompleted ? ' (completed)' : ''}`}
                  >
                    <span className="quote-page__progress-circle">
                      {isCompleted ? <FiCheck /> : step.number}
                    </span>
                    <span className="quote-page__progress-label">
                      {step.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <form className="quote-page__form" onSubmit={handleSubmit} noValidate>
        {/* ════════════════════════════════════════
            Step 1 – Choose Your Material
           ════════════════════════════════════════ */}
        <section
          className="section quote-page__section"
          id="choose-material"
          ref={stepRefs[1]}
        >
          <div className="container">
            <div className="quote-page__card">
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
                {/* Undecided option — for visitors who haven't chosen a colour */}
                <button
                  type="button"
                  className={`quote-page__swatch-tile quote-page__swatch-tile--undecided${
                    undecided ? ' quote-page__swatch-tile--selected' : ''
                  }`}
                  onClick={handleUndecided}
                  aria-pressed={undecided}
                  aria-label={`I'm undecided about the colour${
                    undecided ? ' (selected)' : ''
                  }`}
                >
                  <div className="quote-page__swatch-undecided" aria-hidden="true">
                    <span className="quote-page__swatch-undecided-mark">?</span>
                  </div>
                  <div className="quote-page__swatch-info">
                    <span className="quote-page__swatch-name">Undecided</span>
                    <span className="quote-page__swatch-material">
                      Help me choose later
                    </span>
                  </div>
                  <span
                    className="quote-page__swatch-check"
                    aria-hidden="true"
                  >
                    <FiCheck />
                  </span>
                </button>

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
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            Step 2 – Kitchen Plan
           ════════════════════════════════════════ */}
        <section
          className="section section--cream quote-page__section"
          id="kitchen-plan"
          ref={stepRefs[2]}
        >
          <div className="container">
            <div className="quote-page__card">
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

                <button
                  type="button"
                  className={`quote-page__plan-card${
                    planMode === 'none' ? ' quote-page__plan-card--active' : ''
                  }`}
                  onClick={() => {
                    const next = planMode === 'none' ? null : 'none';
                    setPlanMode(next);
                    /* Selecting "Not yet" advances to the details stage */
                    if (next === 'none') {
                      stepRefs[3].current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }
                  }}
                  aria-pressed={planMode === 'none'}
                >
                  <FiCalendar className="quote-page__plan-card-fi-icon" />
                  <span className="quote-page__plan-card-title">
                    Not Yet
                  </span>
                  <span className="quote-page__plan-card-desc">
                    I don&rsquo;t have my kitchen plans yet
                  </span>
                </button>
              </div>

              {/* No plans yet — reassurance message */}
              {planMode === 'none' && (
                <p className="quote-page__plan-note">
                  No problem &mdash; we&rsquo;ll arrange a free template visit to
                  measure everything for you once you&rsquo;re ready.
                </p>
              )}

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
                    }`}
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
                    aria-label="Upload kitchen plan files"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ACCEPTED_TYPES}
                      className="quote-page__file-input"
                      onChange={(e) => {
                        handleFileSelect(e.target.files);
                        e.target.value = '';
                      }}
                    />
                    <FiUploadCloud className="quote-page__dropzone-icon" />
                    <span className="quote-page__dropzone-text">
                      Drag &amp; drop your files here, or click to browse
                    </span>
                    <span className="quote-page__dropzone-hint">
                      JPG, PNG or PDF &mdash; max 10 MB each. You can add several.
                    </span>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <ul className="quote-page__file-list">
                      {uploadedFiles.map((file, i) => (
                        <li key={`${file.name}_${i}`} className="quote-page__file-item">
                          <FiCheck className="quote-page__file-item-icon" aria-hidden="true" />
                          <span className="quote-page__file-item-name">{file.name}</span>
                          <button
                            type="button"
                            className="quote-page__file-remove"
                            onClick={() => removeFile(i)}
                            aria-label={`Remove ${file.name}`}
                          >
                            <FiX aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {uploadedFiles.length > 0 && (
                    <button
                      type="button"
                      className="quote-page__file-add-more"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiPlus aria-hidden="true" /> Add more attachments
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            Step 3 – Your Details
           ════════════════════════════════════════ */}
        <section
          className="section quote-page__section"
          id="your-details"
          ref={stepRefs[3]}
        >
          <div className="container">
            <div className="quote-page__card">
              <div className="quote-page__section-header">
                <span className="quote-page__step-number">3</span>
                <div>
                  <h2 className="quote-page__section-title">Your Details</h2>
                  <p className="quote-page__section-desc">
                    We&rsquo;ll use these details to prepare and send your quote.
                  </p>
                </div>
              </div>

              <div className="quote-page__details-layout">
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

              {/* Reassuring customer quote beside the form */}
              <aside className="quote-page__details-quote" aria-label="Customer review">
                <span className="quote-page__details-quote-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="quote-page__details-quote-text">
                  The process from the initial quote right through to completing
                  my kitchen was incredible &mdash; I&rsquo;ve never seen anything
                  like it.
                </blockquote>
                <div className="quote-page__details-quote-stars" aria-hidden="true">
                  ★★★★★
                </div>
                <p className="quote-page__details-quote-author">
                  Adrian
                </p>
              </aside>
              </div>
            </div>
          </div>
        </section>
      </form>

      {/* ════════════════════════════════════════
          Trust / Social Proof
         ════════════════════════════════════════ */}
      <section className="section quote-page__trust">
        <div className="container">
          <span className="quote-page__trust-overline">
            The Quartz Company
          </span>
          <h2 className="quote-page__trust-title">
            You&rsquo;re in Safe Hands
          </h2>
          <p className="quote-page__trust-subtitle">
            Homeowners across the Midlands trust us to craft and fit their
            dream kitchen worktops &mdash; and love the result.
          </p>

          {/* Trust badges */}
          <div className="quote-page__trust-badges">
            <div className="quote-page__trust-badge">
              <span className="quote-page__trust-badge-value">25 Year</span>
              <span className="quote-page__trust-badge-label">
                Surface Warranty
              </span>
            </div>
            <div className="quote-page__trust-badge">
              <span className="quote-page__trust-badge-value">
                <span className="quote-page__trust-badge-stars">★★★★★</span>
              </span>
              <span className="quote-page__trust-badge-label">
                Rated by our customers
              </span>
            </div>
            <div className="quote-page__trust-badge">
              <span className="quote-page__trust-badge-value">Free</span>
              <span className="quote-page__trust-badge-label">
                Template &amp; Design Visit
              </span>
            </div>
            <div className="quote-page__trust-badge">
              <span className="quote-page__trust-badge-value">10&ndash;20</span>
              <span className="quote-page__trust-badge-label">
                Days Quick Turnaround
              </span>
            </div>
          </div>

          {/* Customer review carousel */}
          <div className="quote-page__carousel">
            <button
              type="button"
              className="quote-page__carousel-arrow quote-page__carousel-arrow--prev"
              onClick={prevReview}
              aria-label="Previous review"
            >
              <FiChevronLeft />
            </button>

            <figure className="quote-page__carousel-card" key={activeReview.id}>
              <span className="quote-page__carousel-mark" aria-hidden="true">
                &ldquo;
              </span>
              <div
                className="quote-page__carousel-stars"
                aria-label={`${activeReview.rating} out of 5 stars`}
              >
                {renderStars(activeReview.rating)}
              </div>
              <blockquote className="quote-page__carousel-text">
                {activeReview.text}
              </blockquote>
              <figcaption className="quote-page__carousel-author">
                <span className="quote-page__carousel-name">
                  {activeReview.name}
                </span>
                <span className="quote-page__carousel-meta">
                  {activeReview.location}
                  {activeReview.product ? ` · ${activeReview.product}` : ''}
                </span>
              </figcaption>
            </figure>

            <button
              type="button"
              className="quote-page__carousel-arrow quote-page__carousel-arrow--next"
              onClick={nextReview}
              aria-label="Next review"
            >
              <FiChevronRight />
            </button>
          </div>

          {/* Carousel dots */}
          <div className="quote-page__carousel-dots">
            {QUOTE_REVIEWS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={`quote-page__carousel-dot${
                  i === reviewIndex ? ' quote-page__carousel-dot--active' : ''
                }`}
                onClick={() => setReviewIndex(i)}
                aria-label={`Go to review ${i + 1} of ${reviewCount}`}
                aria-current={i === reviewIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
