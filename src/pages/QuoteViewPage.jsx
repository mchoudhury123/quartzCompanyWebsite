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
        <div className="qv__accent qv__accent--top" />
        <div className="qv__card">
          <div className="qv__loading">Loading your quote…</div>
        </div>
        <div className="qv__accent qv__accent--bottom" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="qv">
        <div className="qv__accent qv__accent--top" />
        <div className="qv__card">
          <div className="qv__logo-wrap">
            <img src="/LOGO IDEA BIG QUARTZ ARIAL.png" alt="The Quartz Company" className="qv__logo-img" />
          </div>
          <div className="qv__divider" />
          <p className="qv__error">We couldn't find this quote. Please check the link or contact us.</p>
        </div>
        <div className="qv__accent qv__accent--bottom" />
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

  const createdDate = new Date(quote.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const priceBefore = (item) => {
    if (item.original_price !== undefined) return item.original_price;
    return (item.material_cost || 0) + (item.features_total || 0) + (item.discount || 0);
  };

  return (
    <div className="qv">
      <div className="qv__accent qv__accent--top" />

      <div className="qv__card">
        {isExpired && (
          <div className="qv__expired">
            This quote has expired — please contact us for an updated one.
          </div>
        )}

        <div className="qv__logo-wrap">
          <img src="/LOGO IDEA BIG QUARTZ ARIAL.png" alt="The Quartz Company" className="qv__logo-img" />
        </div>
        <div className="qv__divider" />

        <p className="qv__eyebrow">Your Quotation</p>
        <h1 className="qv__quote-number">{quote.quote_number}</h1>

        <dl className="qv__info">
          <div className="qv__info-row">
            <dt>Date</dt>
            <dd>{createdDate}</dd>
          </div>
          {validDate && (
            <div className="qv__info-row">
              <dt>Valid Until</dt>
              <dd className={isExpired ? 'qv__info-expired' : ''}>{validDate}</dd>
            </div>
          )}
          {quote.description && (
            <div className="qv__info-row">
              <dt>Description</dt>
              <dd>{quote.description}</dd>
            </div>
          )}
        </dl>

        <div className="qv__hr" />

        {materials.length > 0 && (
          <section className="qv__section">
            <p className="qv__section-label">Materials</p>
            {materials.map((item, i) => {
              const before = priceBefore(item);
              const hasDiscount = item.discount > 0 && before > item.line_total;
              const dims = item.x_mm && item.y_mm ? `${item.x_mm}×${item.y_mm}mm` : '';
              return (
                <div key={`m-${i}`} className="qv__line">
                  <div className="qv__line-head">
                    <div className="qv__line-name">
                      <span className="qv__line-title">
                        {item.piece_type}{item.description ? ` — ${item.description}` : ''}
                      </span>
                      {dims && <span className="qv__line-dims">{dims}</span>}
                    </div>
                    <span className="qv__line-total">{fmt(item.line_total)}</span>
                  </div>
                  {hasDiscount && (
                    <div className="qv__line-sub">
                      <span className="qv__line-was">Was {fmt(before)}</span>
                      <span className="qv__line-save">Saving {fmt(item.discount)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {accessories.length > 0 && (
          <section className="qv__section">
            <p className="qv__section-label">Products &amp; Accessories</p>
            {accessories.map((item, i) => (
              <div key={`a-${i}`} className="qv__line">
                <div className="qv__line-head">
                  <div className="qv__line-name">
                    <span className="qv__line-title">{item.product_name}</span>
                    {item.quantity > 1 && <span className="qv__line-dims">×{item.quantity}</span>}
                  </div>
                  <span className="qv__line-total">{fmt(item.line_total)}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        <div className="qv__hr" />

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

        <div className="qv__hr" />

        <div className="qv__deposit">
          <p className="qv__section-label">Deposit to Secure</p>
          <div className="qv__deposit-amount">{fmt(deposit)}</div>
          <p className="qv__deposit-note">
            A 20% deposit secures your quote{validDate ? ` until ${validDate}` : ''}.
          </p>
          {!isExpired && (
            <div className="qv__cta">
              <a href="tel:+447375303416" className="qv__btn qv__btn--primary">
                Contact to Pay
              </a>
              <a
                href="mailto:sales@thequartzcompany.co.uk"
                className="qv__btn qv__btn--secondary"
              >
                Email Us
              </a>
            </div>
          )}
        </div>

        <div className="qv__footer">
          <p className="qv__footer-brand">The Quartz Company</p>
          <p className="qv__footer-details">
            sales@thequartzcompany.co.uk &nbsp;·&nbsp; 07375 303 416
          </p>
        </div>
      </div>

      <div className="qv__accent qv__accent--bottom" />
    </div>
  );
}
