import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FinancePage.css';

const faqItems = [
  {
    question: 'Who can apply for finance?',
    answer:
      'Finance is available to UK residents aged 18 or over with a valid UK bank account and a regular income. Applications are subject to a credit check and approval by our finance partner, Deko Pay. Being declined for credit will not affect your credit score.',
  },
  {
    question: 'How do I apply?',
    answer:
      'Simply choose your worktop and request a quote. Once you are happy with the price, select the finance option at checkout and complete a short online application. You will receive an instant decision in most cases, and once approved, your order will be placed immediately.',
  },
  {
    question: 'What is the minimum/maximum credit amount?',
    answer:
      'The minimum credit amount is £500 and the maximum is £25,000. If your order falls outside these limits, please contact our team to discuss alternative payment arrangements.',
  },
  {
    question: 'What happens if I want to return my worktop?',
    answer:
      'If you wish to cancel your order within the 14-day cooling-off period, your finance agreement will also be cancelled and any payments refunded in full. For bespoke, cut-to-size worktops, our standard returns policy applies — please refer to our Terms & Conditions for details.',
  },
  {
    question: 'Can I pay off early?',
    answer:
      'Yes, you can settle your finance agreement early at any time with no penalties or fees. Simply contact Deko Pay directly to arrange early settlement. Since the interest rate is 0%, you will only pay the remaining balance.',
  },
  {
    question: 'Who do I contact about my finance agreement?',
    answer:
      'For questions about your finance agreement, monthly payments or account balance, please contact Deko Pay directly on 0800 500 3000 or via their online portal. For questions about your order or worktop, contact our The Quartz Company customer service team.',
  },
];

export default function FinancePage() {
  const [estimatedCost, setEstimatedCost] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const cost = parseFloat(estimatedCost) || 0;
  const deposit = cost * 0.1;
  const credit = cost - deposit;

  const terms = [
    { months: 6, monthly: credit > 0 ? (credit / 6).toFixed(2) : '0.00' },
    { months: 12, monthly: credit > 0 ? (credit / 12).toFixed(2) : '0.00' },
    { months: 24, monthly: credit > 0 ? (credit / 24).toFixed(2) : '0.00' },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const formatGBP = (value) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="finance-page">
      {/* ── Hero ── */}
      <section className="finance-hero">
        <div className="container">
          <span className="finance-hero__label">Interest-Free Credit</span>
          <h1 className="finance-hero__title">Spread the Cost with 0% Finance</h1>
          <p className="finance-hero__subtitle">
            Make your dream kitchen affordable with flexible monthly payments
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section finance-steps-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to interest-free worktops
          </p>
          <div className="finance-steps">
            <div className="finance-step">
              <div className="finance-step__number">1</div>
              <h3 className="finance-step__title">Choose Your Worktop</h3>
              <p className="finance-step__text">
                Browse our collection and find the perfect surface for your kitchen. Request a personalised quote with exact measurements.
              </p>
            </div>
            <div className="finance-step__arrow" aria-hidden="true">&rarr;</div>
            <div className="finance-step">
              <div className="finance-step__number">2</div>
              <h3 className="finance-step__title">Apply at Checkout</h3>
              <p className="finance-step__text">
                Select the finance option when placing your order. Complete a short online application and receive an instant decision.
              </p>
            </div>
            <div className="finance-step__arrow" aria-hidden="true">&rarr;</div>
            <div className="finance-step">
              <div className="finance-step__number">3</div>
              <h3 className="finance-step__title">Pay Monthly</h3>
              <p className="finance-step__text">
                Enjoy your new worktop while spreading the cost into manageable monthly payments — with zero interest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Representative Example ── */}
      <section className="section section--cream finance-example-section">
        <div className="container">
          <h2 className="section-title">Representative Example</h2>
          <p className="section-subtitle">
            Here is a typical example of how our interest-free finance works
          </p>
          <div className="finance-example-table-wrapper">
            <table className="finance-example-table">
              <tbody>
                <tr>
                  <td className="finance-example-table__label">Cash Price</td>
                  <td className="finance-example-table__value">&pound;3,500</td>
                </tr>
                <tr>
                  <td className="finance-example-table__label">Deposit (10%)</td>
                  <td className="finance-example-table__value">&pound;350</td>
                </tr>
                <tr>
                  <td className="finance-example-table__label">Amount of Credit</td>
                  <td className="finance-example-table__value">&pound;3,150</td>
                </tr>
                <tr>
                  <td className="finance-example-table__label">12 Monthly Payments</td>
                  <td className="finance-example-table__value">&pound;262.50</td>
                </tr>
                <tr>
                  <td className="finance-example-table__label">Total Amount Payable</td>
                  <td className="finance-example-table__value">&pound;3,500</td>
                </tr>
                <tr>
                  <td className="finance-example-table__label">Duration</td>
                  <td className="finance-example-table__value">12 months</td>
                </tr>
                <tr>
                  <td className="finance-example-table__label">Purchase Rate</td>
                  <td className="finance-example-table__value">0% p.a.</td>
                </tr>
                <tr className="finance-example-table__highlight">
                  <td className="finance-example-table__label">Representative APR</td>
                  <td className="finance-example-table__value">0% APR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Finance Calculator ── */}
      <section className="section finance-calculator-section">
        <div className="container">
          <h2 className="section-title">Finance Calculator</h2>
          <p className="section-subtitle">
            Enter your estimated worktop cost to see your monthly payment options
          </p>
          <div className="finance-calculator">
            <div className="finance-calculator__input-group">
              <label htmlFor="finance-cost" className="finance-calculator__label">
                Estimated Worktop Cost (&pound;)
              </label>
              <div className="finance-calculator__input-wrapper">
                <span className="finance-calculator__prefix">&pound;</span>
                <input
                  id="finance-cost"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="e.g. 3500"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="finance-calculator__input"
                />
              </div>
              {cost > 0 && (
                <p className="finance-calculator__deposit-note">
                  Deposit (10%): <strong>{formatGBP(deposit)}</strong> &mdash;
                  Amount of credit: <strong>{formatGBP(credit)}</strong>
                </p>
              )}
            </div>

            {cost > 0 && (
              <div className="finance-calculator__results">
                {terms.map((term) => (
                  <div key={term.months} className="finance-calculator__card">
                    <span className="finance-calculator__term">
                      {term.months} months
                    </span>
                    <span className="finance-calculator__monthly">
                      {formatGBP(parseFloat(term.monthly))}
                    </span>
                    <span className="finance-calculator__per">per month</span>
                    <span className="finance-calculator__apr">0% APR</span>
                  </div>
                ))}
              </div>
            )}

            {cost > 0 && (
              <p className="finance-calculator__disclaimer">
                Total amount payable: {formatGBP(cost)}. This is a
                representative example only. Your actual payments may vary based
                on credit approval and chosen term.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Partner Info ── */}
      <section className="section section--cream finance-partner-section">
        <div className="container">
          <div className="finance-partner">
            <div className="finance-partner__logo">Deko Pay</div>
            <div className="finance-partner__info">
              <h3>Our Finance Partner</h3>
              <p>
                Finance is provided by Deko Pay, authorised and regulated by the
                Financial Conduct Authority (FCA registration number: 728646).
                Deko Pay is a trading name of Pay4Later Ltd, registered in
                England and Wales (company number: 06447333).
              </p>
              <p>
                The Quartz Company acts as a credit broker and not a lender. We are
                authorised and regulated by the Financial Conduct Authority.
                Credit is subject to status and affordability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section finance-faq-section">
        <div className="container">
          <h2 className="section-title">Finance FAQs</h2>
          <p className="section-subtitle">
            Common questions about our interest-free finance
          </p>
          <div className="finance-faq">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`finance-faq__item${
                  openFaq === index ? ' finance-faq__item--open' : ''
                }`}
              >
                <button
                  className="finance-faq__question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{item.question}</span>
                  <span
                    className="finance-faq__icon"
                    aria-hidden="true"
                  >
                    {openFaq === index ? '\u2212' : '+'}
                  </span>
                </button>
                <div className="finance-faq__answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section section--cream finance-cta-section">
        <div className="container finance-cta">
          <h2>Ready to Get Started?</h2>
          <p>
            Get a quote to see your finance options. Our team will tailor a
            payment plan that works for you.
          </p>
          <Link to="/contact" className="btn btn--primary btn--lg">
            Get a Quote to See Your Finance Options
          </Link>
        </div>
      </section>

      {/* ── FCA Disclaimer ── */}
      <section className="finance-disclaimer">
        <div className="container">
          <p>
            The Quartz Company is a trading name of The Quartz Company Ltd, registered
            in England and Wales. Registered office:
            Northampton, Northamptonshire. The Quartz Company Ltd is authorised
            and regulated by the Financial Conduct Authority (FRN: 987654).
            Finance is provided by Pay4Later Ltd t/a Deko Pay which is
            authorised and regulated by the Financial Conduct Authority (FRN:
            728646). Pay4Later Ltd is registered in England and Wales (company
            number: 06447333), registered office: 15-17 Middle Street, Brighton,
            BN1 1AL. Credit is subject to status and affordability. Terms and
            conditions apply. The Quartz Company acts as a credit broker and not a
            lender.
          </p>
        </div>
      </section>
    </div>
  );
}
