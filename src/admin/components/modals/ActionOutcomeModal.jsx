import { useState } from 'react';
import ModalShell from './ModalShell';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function ActionOutcomeModal({ action, onComplete, onClose }) {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handleOutcome = async (outcomes) => {
    setProcessing(true);
    await onComplete(outcomes);
    setProcessing(false);
    onClose();
  };

  // Chase measurements flow
  if (action === 'chase_measurements') {
    return (
      <ModalShell title="Chase Measurements — Outcome" onClose={onClose}>
        <p className="modal-field__label" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          Did you get the kitchen measurements?
        </p>
        <div className="modal-actions">
          <button
            className="modal-actions__btn modal-actions__btn--submit"
            style={{ background: '#16a34a' }}
            onClick={() => handleOutcome({ gotMeasurements: true })}
            disabled={processing}
          >
            <FiCheck /> Yes — ready to quote
          </button>
          <button
            className="modal-actions__btn modal-actions__btn--cancel"
            onClick={() => handleOutcome({ gotMeasurements: false })}
            disabled={processing}
          >
            <FiX /> No — try again later
          </button>
        </div>
      </ModalShell>
    );
  }

  // Call flow (call_new / follow_up)
  const isFollowUp = action === 'follow_up';
  const title = isFollowUp ? 'Follow-up Call — Outcome' : 'New Lead Call — Outcome';

  // Step 1: Did they answer?
  if (step === 1) {
    return (
      <ModalShell title={title} onClose={onClose}>
        <p className="modal-field__label" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          Did the customer answer?
        </p>
        <div className="modal-actions">
          <button
            className="modal-actions__btn modal-actions__btn--submit"
            style={{ background: '#16a34a' }}
            onClick={() => setStep(2)}
            disabled={processing}
          >
            <FiCheck /> Yes
          </button>
          <button
            className="modal-actions__btn modal-actions__btn--cancel"
            style={{ background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}
            onClick={() => handleOutcome({ answered: false })}
            disabled={processing}
          >
            {processing ? <><FiLoader /> Processing...</> : <><FiX /> No</>}
          </button>
        </div>
        {isFollowUp && (
          <p style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: '0.75rem', lineHeight: 1.5 }}>
            If they didn't answer again, the lead will be marked as lost and an email will be sent automatically.
          </p>
        )}
      </ModalShell>
    );
  }

  // Step 2: Can you quote them?
  return (
    <ModalShell title={title} onClose={onClose}>
      <p className="modal-field__label" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        Can you quote them now?
      </p>
      <div className="modal-actions">
        <button
          className="modal-actions__btn modal-actions__btn--submit"
          style={{ background: '#16a34a' }}
          onClick={() => handleOutcome({ answered: true, canQuote: true })}
          disabled={processing}
        >
          <FiCheck /> Yes — ready to quote
        </button>
        <button
          className="modal-actions__btn modal-actions__btn--cancel"
          style={{ background: '#d97706', color: '#fff', borderColor: '#d97706' }}
          onClick={() => handleOutcome({ answered: true, canQuote: false })}
          disabled={processing}
        >
          {processing ? <><FiLoader /> Processing...</> : <><FiX /> No — need measurements</>}
        </button>
      </div>
    </ModalShell>
  );
}
