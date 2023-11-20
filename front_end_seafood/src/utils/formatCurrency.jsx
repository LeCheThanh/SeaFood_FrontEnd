export function formatCurrency(amount, currencyCode) {
    if (amount == null || isNaN(amount)) {
      return ''; // Hoặc giá trị mặc định khác tùy ý
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: currencyCode });
  }