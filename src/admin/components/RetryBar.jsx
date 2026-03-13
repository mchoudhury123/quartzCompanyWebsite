import { useState } from 'react';
import { FiAlertCircle, FiPhone, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import './ActionBar.css';

export default function RetryBar({ onAnswered }) {
  const [step, setStep] = useState(1); // 1 = did they answer?, 2 = can you quote?
  const [processing, setProcessing] = useState(false);

  const handleQuoteOutcome = async (canQuote) => {
    setProcessing(true);
    await onAnswered({ canQuote });
    setProcessing(false);
  };

  return (
    <div className="action-bar">
      <div className="action-bar__left">
        <FiAlertCircle className="action-bar__alert-icon" />
        <FiPhone className="action-bar__type-icon" />
        <span className="action-bar__label">
          {step === 1
            ? "This customer didn\u2019t answer twice \u2014 call them again. Did they answer?"
            : 'Can you quote them now?'}
        </span>
      </div>
      <div className="action-bar__btns">
        {step === 1 ? (
          <>
            <button className="action-bar__btn action-bar__btn--yes" onClick={() => setStep(2)}>
              <FiCheck /> Yes
            </button>
            <button className="action-bar__btn action-bar__btn--no" onClick={() => setStep(1)}>
              <FiX /> No
            </button>
          </>
        ) : (
          <>
            <button
              className="action-bar__btn action-bar__btn--yes"
              onClick={() => handleQuoteOutcome(true)}
              disabled={processing}
            >
              {processing ? <FiLoader /> : <FiCheck />} Yes
            </button>
            <button
              className="action-bar__btn action-bar__btn--no"
              onClick={() => handleQuoteOutcome(false)}
              disabled={processing}
            >
              {processing ? <FiLoader /> : <FiX />} No — need measurements
            </button>
          </>
        )}
      </div>
    </div>
  );
}
