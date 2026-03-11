import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './QuoteViewPage.css';

export default function QuoteViewPage() {
  const { quoteId } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quoteId) return;
    supabase
      .from('lead_quotes')
      .select('*')
      .eq('id', quoteId)
      .single()
      .then(({ data }) => {
        setQuote(data || null);
        setLoading(false);
      });
  }, [quoteId]);

  const fmt = (n) => `£${Number(n || 0).toFixed(2)}`;

  if (loading) {
    return (
      <div className="qv">
        <div className="qv__loading">Loading quote...</div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="qv">
        <div className="qv__container">
          <div className="qv__header">
            <h1 className="qv__logo">THE QUARTZ COMPANY</h1>
          </div>
          <div className="qv__error">Quote not found.</div>
        </div>
      </div>
    );
  }

  const isExpired = quote.valid_until && new Date(quote.valid_until) < new Date();

  const items = quote.items || [];
  const materials = items.filter((i) => i.type === 'piece');
  const accessories = items.filter((i) => i.type === 'accessory');

  const subtotal = quote.subtotal || 0;
  const vat = quote.vat || 0;
  const total = quote.total || 0;
  const deposit = quote.deposit_amount || total * 0.2;

  const validDate = quote.valid_until
    ? new Date(quote.valid_until).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <div className="qv">
      <div className="qv__container">
        {/* Header */}
        <div className="qv__header">
          <h1 className="qv__logo">THE QUARTZ COMPANY</h1>
        </div>

        {/* Expiry Banner */}
        {isExpired && (
          <div className="qv__expired-banner">
            This quote has expired. Please contact us for an updated quote.
          </div>
        )}

        {/* Quote Info */}
        <div className="qv__info">
          <div className="qv__info-row">
            <span className="qv__info-label">Quote Number</span>
            <span className="qv__info-value">{quote.quote_number}</span>
          </div>
          <div className="qv__info-row">
            <span className="qv__info-label">Date</span>
            <span className="qv__info-value">
              {new Date(quote.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
          {validDate && (
            <div className="qv__info-row">
              <span className="qv__info-label">Valid Until</span>
              <span className={`qv__info-value ${isExpired ? 'qv__info-value--expired' : ''}`}>
                {validDate}
              </span>
            </div>
          )}
          {quote.description && (
            <div className="qv__info-row">
              <span className="qv__info-label">Description</span>
              <span className="qv__info-value">{quote.description}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="qv__items">
          <table className="qv__table">
            <thead>
              <tr>
                <th className="qv__th">Item</th>
                <th className="qv__th qv__th--right">Price</th>
                <th className="qv__th qv__th--right">Discount</th>
                <th className="qv__th qv__th--right">Total</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 && (
                <>
                  <tr><td colSpan={4} className="qv__section-label">Materials</td></tr>
                  {materials.map((item, i) => (
                    <tr key={`m-${i}`} className="qv__row">
                      <td className="qv__cell">
                        {item.piece_type}{item.description ? ` — ${item.description}` : ''}
                        <span className="qv__cell-dims">
                          {item.x_mm && item.y_mm ? ` (${item.x_mm}×${item.y_mm}mm)` : ''}
                        </span>
                      </td>
                      <td className="qv__cell qv__cell--right">
                        {fmt((item.material_cost || 0) + (item.features_total || 0))}
                      </td>
                      <td className="qv__cell qv__cell--right qv__cell--discount">
                        {item.discount > 0 ? `-${fmt(item.discount)}` : '—'}
                      </td>
                      <td className="qv__cell qv__cell--right qv__cell--bold">{fmt(item.line_total)}</td>
                    </tr>
                  ))}
                </>
              )}
              {accessories.length > 0 && (
                <>
                  <tr><td colSpan={4} className="qv__section-label">Products & Accessories</td></tr>
                  {accessories.map((item, i) => (
                    <tr key={`a-${i}`} className="qv__row">
                      <td className="qv__cell">
                        {item.product_name}
                        {item.quantity > 1 && <span className="qv__cell-qty"> ×{item.quantity}</span>}
                      </td>
                      <td className="qv__cell qv__cell--right">{fmt(item.line_total)}</td>
                      <td className="qv__cell qv__cell--right">—</td>
                      <td className="qv__cell qv__cell--right qv__cell--bold">{fmt(item.line_total)}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="qv__totals">
          <div className="qv__total-row">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="qv__total-row">
            <span>VAT @20%</span>
            <span>{fmt(vat)}</span>
          </div>
          <div className="qv__total-row qv__total-row--grand">
            <span>Grand Total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {/* Deposit Section */}
        <div className="qv__deposit">
          <div className="qv__deposit-header">
            <h3 className="qv__deposit-title">Deposit Required</h3>
            <span className="qv__deposit-amount">{fmt(deposit)}</span>
          </div>
          <p className="qv__deposit-note">A deposit of 20% is required to secure your quote.</p>

          {!isExpired ? (
            <div className="qv__deposit-action">
              <a href="tel:+44000000000" className="qv__btn qv__btn--primary">
                Contact to Pay
              </a>
              <a href="mailto:sales@thequartzcompany.co.uk" className="qv__btn qv__btn--secondary">
                Email Us
              </a>
            </div>
          ) : (
            <p className="qv__deposit-expired">This quote has expired. Please contact us for a new quote.</p>
          )}
        </div>

        {/* Footer */}
        <div className="qv__footer">
          <p>The Quartz Company</p>
          <p>sales@thequartzcompany.co.uk</p>
        </div>
      </div>
    </div>
  );
}
