/**
 * Formats a numerical amount or numeric string into Indian Rupee (INR / ₹) standard format.
 * Example: 1299.5 => "₹1,299.50", 0 => "₹0.00"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export default formatCurrency;
