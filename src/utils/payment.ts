const amountPattern = /^\d+(\.\d{0,2})?$/;

export function normalizeAmount(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [whole = '', ...decimalParts] = cleaned.split('.');
  const decimals = decimalParts.join('').slice(0, 2);

  if (!cleaned.includes('.')) {
    return whole;
  }

  return `${whole}.${decimals}`;
}

export function getAmountError(amount: string): string {
  if (!amount.trim()) {
    return 'Enter an amount to continue.';
  }

  if (!amountPattern.test(amount)) {
    return 'Use a valid amount with up to two decimals.';
  }

  if (Number(amount) <= 0) {
    return 'Amount must be greater than zero.';
  }

  return '';
}
