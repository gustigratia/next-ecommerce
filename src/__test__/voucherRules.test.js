import { AVAILABLE_VOUCHERS, calculateOrderPricing } from '@/utils/voucherRules';

describe('voucherRules', () => {
  it('calculates amounts without voucher correctly', () => {
    const result = calculateOrderPricing({
      orderItems: [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ],
    });

    expect(result.isValid).toBe(true);
    expect(result.amountWithoutTax).toBe(250);
    expect(result.taxAmount).toBe(37.5);
    expect(result.baseTotal).toBe(287.5);
    expect(result.discountAmount).toBe(0);
    expect(result.totalAmount).toBe(287.5);
    expect(result.voucherInfo).toBeNull();
  });

  it('rejects invalid voucher codes', () => {
    const result = calculateOrderPricing({
      orderItems: [{ price: 100, quantity: 2 }],
      voucherCode: 'INVALID',
    });

    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Voucher tidak ditemukan.');
  });

  it('rejects expired vouchers', () => {
    jest.useFakeTimers().setSystemTime(new Date('2027-01-01'));

    const result = calculateOrderPricing({
      orderItems: [{ price: 100, quantity: 2 }],
      voucherCode: 'MERDEKA79',
    });

    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Voucher sudah kadaluarsa.');

    jest.useRealTimers();
  });

  it('accepts valid voucher and applies discount', () => {
    const result = calculateOrderPricing({
      orderItems: [{ price: 1000, quantity: 2 }],
      voucherCode: 'MERDEKA79',
    });

    expect(result.isValid).toBe(true);
    expect(result.discountAmount).toBeGreaterThan(0);
    expect(result.voucherInfo.code).toBe('MERDEKA79');
  });
});
