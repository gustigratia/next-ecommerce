import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockRemoveFromCart = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClearCart = jest.fn();

const cartItems = [
  { _id: 'prod_1', title: 'Classic Sneakers', price: 99.99, quantity: 2, image: '/sneakers.jpg' },
  { _id: 'prod_2', title: 'Running Shoes', price: 129.99, quantity: 1, image: '/running.jpg' },
];

jest.mock('@/context/CartContext', () => ({
  useCart: () => ({
    cart: cartItems,
    removeFromCart: mockRemoveFromCart,
    updateQuantity: mockUpdateQuantity,
    clearCart: mockClearCart,
    totalPrice: 329.97,
  }),
}));

let CartPage;
beforeAll(async () => {
  const mod = await import('@/components/Cart');
  CartPage = mod.default;
});

describe('Cart component', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders all cart items', () => {
    render(<CartPage />);

    expect(screen.getByText('Classic Sneakers')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
  });

  it('shows the correct total price', () => {
    render(<CartPage />);
    expect(screen.getByText(/329\.97/)).toBeInTheDocument();
  });

  it('calls removeFromCart when the remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<CartPage />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('prod_1');
  });

  it('calls updateQuantity when the quantity input changes', async () => {
    const user = userEvent.setup();
    render(<CartPage />);

    const quantityInputs = screen.getAllByRole('spinbutton');
    await user.clear(quantityInputs[0]);
    await user.type(quantityInputs[0], '3');

    expect(mockUpdateQuantity).toHaveBeenCalledWith('prod_1', expect.any(Number));
  });

  it('calls clearCart when "Clear Cart" is clicked', async () => {
    const user = userEvent.setup();
    render(<CartPage />);

    await user.click(screen.getByRole('button', { name: /clear cart/i }));

    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when cart has no items', async () => {
    jest.resetModules();
    jest.mock('@/context/CartContext', () => ({
      useCart: () => ({ cart: [], totalPrice: 0 }),
    }));

    const { default: EmptyCart } = await import('@/components/Cart');
    render(<EmptyCart />);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
