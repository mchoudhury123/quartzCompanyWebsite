// Shared content for the "deposit received — thank you" email.
// Used by both the Stripe webhook (api/stripe-webhook.js) and the backfill
// endpoint (api/send-deposit-confirmations.js) so the wording stays in one
// place. The plain-text body is wrapped in the branded template by
// api/zoho-send-email.js (logo, gold accents, footer).

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
