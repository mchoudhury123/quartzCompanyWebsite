import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BANK_DETAILS } from '../utils/bankDetails';
import './QuoteViewPage.css';

export default function QuoteViewPage() {
  const { quoteId } = useParams();
  const [searchParams] = useSearchParams();
  const justPaid = searchParams.get('paid') === '1';
  const justBalancePaid = searchParams.get('balancepaid') === '1';
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
            <img src="/logo.png" alt="The Quartz Company" className="qv__logo-img" />
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
  const depositPct = total > 0 ? Math.round((deposit / total) * 100) : 0;
  const depositPaid = quote.deposit_paid || justPaid || quote.balance_paid || justBalancePaid;
  const balancePaid = quote.balance_paid || justBalancePaid;
  const balance = Math.max(0, total - deposit);

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

  const reference = quote.quote_number || '';
  const bankBox = (
    <div className="qv__bank">
      <p className="qv__bank-title">Pay by Bank Transfer</p>
      <dl className="qv__bank-list">
        <div className="qv__bank-row"><dt>Account name</dt><dd>{BANK_DETAILS.accountName}</dd></div>
        <div className="qv__bank-row"><dt>Sort code</dt><dd>{BANK_DETAILS.sortCode}</dd></div>
        <div className="qv__bank-row"><dt>Account number</dt><dd>{BANK_DETAILS.accountNumber}</dd></div>
        <div className="qv__bank-row"><dt>Bank</dt><dd>{BANK_DETAILS.bankName}</dd></div>
        <div className="qv__bank-row"><dt>Reference</dt><dd>{reference}</dd></div>
      </dl>
      <p className="qv__bank-note">
        Please use <strong>{reference}</strong> as your payment reference. Once you've sent the
        transfer, reply to your quote email or call <a href="tel:+447375303416">07375 303 416</a> and
        we'll confirm your order.
      </p>
    </div>
  );

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
          <img src="/logo.png" alt="The Quartz Company" className="qv__logo-img" />
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
              const qty = item.quantity || 1;
              return (
                <div key={`m-${i}`} className="qv__line">
                  <div className="qv__line-head">
                    <div className="qv__line-name">
                      <span className="qv__line-title">
                        {item.piece_type === 'specialist'
                          ? `${item.description || 'Custom Worktop'} (Specialist Worktop)`
                          : `${item.piece_type}${item.description ? ` — ${item.description}` : ''}`}
                      </span>
                      {(dims || qty > 1) && (
                        <span className="qv__line-dims">
                          {dims}{dims && qty > 1 ? ' · ' : ''}{qty > 1 ? `Qty ${qty}` : ''}
                        </span>
                      )}
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
          {balancePaid ? (
            <>
              <p className="qv__section-label">Payment</p>
              <p className="qv__deposit-paid">
                ✓ Paid in full — thank you! Your order is complete and we'll be in touch to confirm
                your installation details.
              </p>
            </>
          ) : depositPaid ? (
            <>
              <p className="qv__section-label">Balance Due</p>
              <div className="qv__deposit-amount">{fmt(balance)}</div>
              <p className="qv__deposit-paid">✓ Deposit of {fmt(deposit)} received — thank you!</p>
              <p className="qv__deposit-note">Pay the remaining balance to complete your order.</p>
              {bankBox}
            </>
          ) : (
            <>
              <p className="qv__section-label">Deposit to Secure</p>
              <div className="qv__deposit-amount">{fmt(deposit)}</div>
              <p className="qv__deposit-note">
                A {depositPct}% deposit secures your quote{validDate ? ` until ${validDate}` : ''}.
              </p>
              {!isExpired && bankBox}
            </>
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
