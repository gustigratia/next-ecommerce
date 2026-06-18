'use client';

import { fireEvent, render, screen } from '@testing-library/react';

import CheckoutVoucher from '@/app/components/CheckoutVoucher';

describe('CheckoutVoucher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders voucher panel and input', () => {
    render(<CheckoutVoucher />);

    expect(screen.getByText(/Makin Hemat Pakai Promo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Masukkan kode Voucher/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pakai/i })).toBeInTheDocument();
  });

  it('shows an error when voucher code is empty', () => {
    render(<CheckoutVoucher />);

    fireEvent.click(screen.getByRole('button', { name: /Pakai/i }));

    expect(screen.getByText(/Masukkan kode voucher terlebih dahulu\./i)).toBeInTheDocument();
  });

  it('shows error for invalid voucher code', () => {
    render(<CheckoutVoucher />);

    fireEvent.change(screen.getByPlaceholderText(/Masukkan kode Voucher/i), {
      target: { value: 'INVALID' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Pakai/i }));

    expect(
      screen.getByText(/Voucher tidak ditemukan atau sudah kadaluarsa\./i)
    ).toBeInTheDocument();
  });

  it('selects voucher and confirms with valid code', () => {
    const onApplyVoucher = jest.fn();
    render(<CheckoutVoucher onApplyVoucher={onApplyVoucher} amountWithoutTax={3000} />);

    fireEvent.change(screen.getByPlaceholderText(/Masukkan kode Voucher/i), {
      target: { value: 'merdeka79' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Pakai/i }));

    expect(screen.getByText(/Voucher MERDEKA79 berhasil dipilih\./i)).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /Konfirmasi/i });
    fireEvent.click(confirmButton);

    expect(onApplyVoucher).toHaveBeenCalledWith(expect.objectContaining({ code: 'MERDEKA79' }));
    expect(localStorage.getItem('appliedPromoCode')).toBe('MERDEKA79');
    expect(screen.getByText(/Voucher MERDEKA79 berhasil digunakan\./i)).toBeInTheDocument();
  });

  it('blocks voucher if amount is too low', () => {
    render(<CheckoutVoucher amountWithoutTax={1000} />);

    fireEvent.change(screen.getByPlaceholderText(/Masukkan kode Voucher/i), {
      target: { value: 'MERDEKA79' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Pakai/i }));

    expect(
      screen.getByText(/Minimal belanja untuk voucher ini adalah £1\.500\./i)
    ).toBeInTheDocument();
  });
});
