// Utility functions for formatting
export const formatCurrency = (amount, currency = 'NGN') => {
  if (amount === null || amount === undefined) return '₦0.00';

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return '₦0.00';

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

// For backward compatibility, also export as formatNaira
export const formatNaira = formatCurrency;