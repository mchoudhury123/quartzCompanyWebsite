// Shared content for the deposit/balance payment emails.
// Used by the Stripe handler (api/stripe.js) and the admin "request balance"
// action so the wording stays in one place. The plain-text body is wrapped in
// the branded template by api/zoho-send-email.js (logo, gold accents, footer).

import { BANK_DETAILS } from './bankDetails.js';

// Plain-text bank transfer block for emails. The reference is the quote number.
function bankTransferText(reference) {
  return `Account name: ${BANK_DETAILS.accountName}
Sort code: ${BANK_DETAILS.sortCode}
Account number: ${BANK_DETAILS.accountNumber}
Bank: ${BANK_DETAILS.bankName}
Reference: ${reference || '(your quote number)'}`;
}

export function buildDepositConfirmationEmail({ firstName = 'there', quoteNumber = '' } = {}) {
  const ref = quoteNumber ? ` (${quoteNumber})` : '';

  return {
    subject: 'Deposit received — thank you | The Quartz Company',
    body: `Hi ${firstName},

Thank you — we've received your deposit${ref} and your order is now confirmed.

Our team is already getting to work on creating your worktops to the highest quality. We'll be in touch very shortly to arrange the next steps, including templating and installation.

If you have any questions in the meantime, simply reply to this email or call us on 07375 303 416.

Thank you for choosing The Quartz Company — we can't wait to create something beautiful for your home.

Warm regards,
The Quartz Company`,
  };
}

// Sent when the customer pays the remaining balance (order fully paid).
export function buildBalanceConfirmationEmail({ firstName = 'there', quoteNumber = '' } = {}) {
  const ref = quoteNumber ? ` (${quoteNumber})` : '';

  return {
    subject: 'Balance received — paid in full | The Quartz Company',
    body: `Hi ${firstName},

Thank you — we've received your balance payment and your order${ref} is now paid in full.

That's everything settled. Our team will be in touch to confirm your final installation details, and we'll take it from here to get your worktops fitted beautifully.

If you have any questions, simply reply to this email or call us on 07375 303 416.

Thank you for choosing The Quartz Company.

Warm regards,
The Quartz Company`,
  };
}

// Sent by the admin to ask the customer to pay the remaining balance.
// The balance is paid by bank transfer using the quote number as reference.
export function buildBalanceDueEmail({ firstName = 'there', quoteNumber = '', balanceText = '' } = {}) {
  const ref = quoteNumber ? ` ${quoteNumber}` : '';
  const amount = balanceText ? ` of ${balanceText}` : '';

  return {
    subject: `Your balance is now due | The Quartz Company`,
    body: `Hi ${firstName},

Great news — your worktops${ref} are progressing, and the remaining balance${amount} is now due.

Please pay the balance by bank transfer:

${bankTransferText(quoteNumber)}

Once your balance is settled we'll confirm your final installation details. If you'd prefer to pay over the phone or have any questions, just reply to this email or call us on 07375 303 416.

Thank you,
The Quartz Company`,
  };
}
