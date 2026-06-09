/**
 * Integration Tests — WishlistPage component
 *
 * This test targets the wishlist page component:
 * src/app/wishlist/page.jsx
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CartContext from '@/app/context/CartContext';
import WishlistPage from '@/app/wishlist/page';

const mockAddItemToCart = jest.fn();
const mockRemoveFromWishlist = jest.fn();
const mockClearWishlist = jest.fn();
const mockUseWishlist = jest.fn();

jest.mock('@/app/context/CartContext', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: React.createContext({
      cart: { cartItems: [] },
      addItemToCart: jest.fn(),
      deleteItemFromCart: jest.fn(),
      clearCart: jest.fn(),
    }),
  };
});

jest.mock('@/app/context/WishlistContext', () => ({
  __esModule: true,
  useWishlist: () => mockUseWishlist(),
}));

jest.mock('react-star-ratings', () => {
  return function MockStarRatings({ rating }) {
    return <div data-testid="wishlist-rating">Rating: {rating}</div>;
  };
});

const wishlistItems = [
  {
    product: 'prod_1',
    _id: 'prod_1',
    name: 'Classic Sneakers',
    price: 99.99,
    imageUrl: '/images/sneakers.jpg',
    ratings: 4.5,
    stock: 20,
    seller: 'Nike',
  },
];

function renderWishlistPage(items = wishlistItems) {
  mockUseWishlist.mockReturnValue({
    wishlist: {
      wishlistItems: items,
    },
    removeFromWishlist: mockRemoveFromWishlist,
    clearWishlist: mockClearWishlist,
  });

  return render(
    <CartContext.Provider
      value={{
        cart: { cartItems: [] },
        addItemToCart: mockAddItemToCart,
        deleteItemFromCart: jest.fn(),
        clearCart: jest.fn(),
      }}
    >
      <WishlistPage />
    </CartContext.Provider>
  );
}

describe('WishlistPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  it('renders the empty wishlist state', () => {
    renderWishlistPage([]);

    expect(screen.getByText(/your wishlist is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/save your favorite products/i)).toBeInTheDocument();

    const browseLink = screen.getByRole('link', {
      name: /browse products/i,
    });

    expect(browseLink).toBeInTheDocument();
    expect(browseLink).toHaveAttribute('href', '/productList');
  });

  it('renders wishlist items', () => {
    renderWishlistPage();

    expect(screen.getByText('Classic Sneakers')).toBeInTheDocument();
    expect(screen.getByText(/99[,.]99/)).toBeInTheDocument();
    expect(screen.getByText(/\(1 item\)/i)).toBeInTheDocument();
  });

  it('renders the product image', () => {
    renderWishlistPage();

    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('sneakers.jpg'));
    expect(img).toHaveAttribute('alt', 'Classic Sneakers');
  });

  it('renders the product detail link with the correct href', () => {
    renderWishlistPage();

    const link = screen.getByRole('link', {
      name: /classic sneakers/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/productList/prod_1');
  });

  it('displays product rating', () => {
    renderWishlistPage();

    expect(screen.getByTestId('wishlist-rating')).toBeInTheDocument();
    expect(screen.getByText(/Rating: 4\.5/)).toBeInTheDocument();
  });

  it('calls addItemToCart when Add to Cart is clicked', async () => {
    const user = userEvent.setup();

    renderWishlistPage();

    const addToCartButton = screen.getByRole('button', {
      name: /add to cart/i,
    });

    await user.click(addToCartButton);

    expect(mockAddItemToCart).toHaveBeenCalledTimes(1);
    expect(mockAddItemToCart).toHaveBeenCalledWith({
      product: 'prod_1',
      name: 'Classic Sneakers',
      price: 99.99,
      image: '/images/sneakers.jpg',
      stock: 20,
      seller: 'Nike',
    });
  });

  it('calls removeFromWishlist when remove button is clicked', async () => {
    const user = userEvent.setup();

    renderWishlistPage();

    const removeButton = screen.getByRole('button', {
      name: /remove from wishlist/i,
    });

    await user.click(removeButton);

    expect(mockRemoveFromWishlist).toHaveBeenCalledTimes(1);
    expect(mockRemoveFromWishlist).toHaveBeenCalledWith('prod_1');
  });

  it('calls clearWishlist after confirmation', async () => {
    const user = userEvent.setup();

    renderWishlistPage();

    const clearButton = screen.getByRole('button', {
      name: /clear wishlist/i,
    });

    await user.click(clearButton);

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(mockClearWishlist).toHaveBeenCalledTimes(1);
  });

  it('does not call clearWishlist when confirmation is cancelled', async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(() => false);

    renderWishlistPage();

    const clearButton = screen.getByRole('button', {
      name: /clear wishlist/i,
    });

    await user.click(clearButton);

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(mockClearWishlist).not.toHaveBeenCalled();
  });
});
