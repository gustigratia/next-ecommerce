'use client';

import { act, fireEvent, render, screen } from '@testing-library/react';

import PromoModal from '@/app/components/PromoModal';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('PromoModal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('does not render immediately and shows after the timeout', () => {
    render(<PromoModal />);

    expect(screen.queryByText(/Promo Kemerdekaan/i)).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText(/Promo Kemerdekaan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    render(<PromoModal />);

    act(() => {
      jest.advanceTimersByTime(1550);
    });

    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.queryByText(/Promo Kemerdekaan/i)).not.toBeInTheDocument();
  });

  it('claims the voucher and navigates to checkout', () => {
    render(<PromoModal />);

    act(() => {
      jest.advanceTimersByTime(1550);
    });

    const claimButton = screen.getByRole('button', { name: /Klaim Voucher Sekarang/i });
    fireEvent.click(claimButton);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(localStorage.getItem('promoClaimed')).toBe('true');
    expect(localStorage.getItem('appliedPromoCode')).toBe('MERDEKA79');
    expect(mockPush).toHaveBeenCalledWith('/checkout');
  });
});
