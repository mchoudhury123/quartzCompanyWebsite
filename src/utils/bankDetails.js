// Single source of truth for the company bank transfer details.
// Used by the quote email, the online quote page, and the balance-due email
// so the account details can never drift out of sync between them.
//
// Deposits and balances are collected by bank transfer; the payment reference
// is always the quote number so payments can be matched to the right order.
export const BANK_DETAILS = {
  accountName: 'Quartz Company SP LTD',
  sortCode: '30-54-66',
  accountNumber: '88375960',
  bankName: 'Lloyds Bank',
};
