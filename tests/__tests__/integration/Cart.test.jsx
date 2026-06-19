import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CartPage from '@/app/cart/Cart';
import CartContext from '@/app/context/CartContext';

const mockAddItemToCart = jest.fn();
const mockDeleteItemFromCart = jest.fn();

jest.mock('@/app/context/FirebaseContext', () => ({
  __esModule: true,
  useFirebaseAppContext: jest.fn(() => ({
    user: { uid: 'test-user' },
    loading: false,
  })),
}));

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return (
      <a href={typeof href === 'string' ? href : '#'} {...props}>
        {children}
      </a>
    );
  };
});

const cartItems = [
  {
    product: 'prod_1',
    name: 'Classic Sneakers',
    price: 99.99,
    quantity: 2,
    image: '/sneakers.jpg',
    stock: 20,
    seller: 'Nike',
  },
  {
    product: 'prod_2',
    name: 'Running Shoes',
    price: 129.99,
    quantity: 1,
    image: '/running.jpg',
    stock: 15,
    seller: 'Adidas',
  },
];

function renderCart(customItems = cartItems) {
  return render(
    <CartContext.Provider
      value={{
        cart: {
          cartItems: customItems,
        },
        addItemToCart: mockAddItemToCart,
        deleteItemFromCart: mockDeleteItemFromCart,
      }}
    >
      <CartPage />
    </CartContext.Provider>
  );
}

describe('Cart component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all cart items', () => {
    renderCart();

    expect(screen.getByText('Classic Sneakers')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
  });

  it('shows the correct cart summary', () => {
    renderCart();

    expect(screen.getByText(/2 Item\(s\) dalam Keranjang/i)).toBeInTheDocument();
    expect(screen.getByText(/Subtotal:/i)).toBeInTheDocument();
    expect(screen.getByText(/329\.97/)).toBeInTheDocument();
    expect(screen.getByText(/Total Item:/i)).toBeInTheDocument();
    expect(screen.getByText(/3\s*\(Produk\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Harga:/i)).toBeInTheDocument();
  });

  it('calls deleteItemFromCart when Hapus is clicked', async () => {
    const user = userEvent.setup();

    renderCart();

    const removeButtons = screen.getAllByText(/hapus/i);
    await user.click(removeButtons[0]);

    expect(mockDeleteItemFromCart).toHaveBeenCalledWith('prod_1');
  });

  it('calls addItemToCart with increased quantity when plus button is clicked', async () => {
    const user = userEvent.setup();

    renderCart();

    const plusButtons = screen.getAllByRole('button', { name: '+' });
    await user.click(plusButtons[0]);

    expect(mockAddItemToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        product: 'prod_1',
        name: 'Classic Sneakers',
        quantity: 3,
      })
    );
  });

  it('calls addItemToCart with decreased quantity when minus button is clicked', async () => {
    const user = userEvent.setup();

    renderCart();

    const minusButtons = screen.getAllByRole('button', { name: '−' });
    await user.click(minusButtons[0]);

    expect(mockAddItemToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        product: 'prod_1',
        name: 'Classic Sneakers',
        quantity: 1,
      })
    );
  });

  it('shows empty cart count when cart has no items', () => {
    renderCart([]);

    expect(screen.getByText(/0 Item\(s\) dalam Keranjang/i)).toBeInTheDocument();
    expect(screen.queryByText('Classic Sneakers')).not.toBeInTheDocument();
    expect(screen.queryByText(/Subtotal:/i)).not.toBeInTheDocument();
  });
});
