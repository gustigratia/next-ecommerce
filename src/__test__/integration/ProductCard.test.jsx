/**
 * Integration Tests — ProductItem component
 *
 * This test targets the actual product card component in this repo:
 * src/app/productList/ProductItem.jsx
 */
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CartContext from '@/app/context/CartContext';
import ProductItem from '@/app/productList/ProductItem';

const mockAddItemToCart = jest.fn();
const mockIsInWishlist = jest.fn();
const mockToggleWishlist = jest.fn();

jest.mock('@/app/context/FirebaseContext', () => ({
  __esModule: true,
  useFirebaseAppContext: jest.fn(() => ({
    user: { uid: 'test-user' },
    loading: false,
  })),
}));

jest.mock('@/app/context/WishlistContext', () => ({
  __esModule: true,
  useWishlist: () => ({
    wishlist: { wishlistItems: [] },
    addToWishlist: jest.fn(),
    removeFromWishlist: jest.fn(),
    isInWishlist: mockIsInWishlist,
    toggleWishlist: mockToggleWishlist,
    clearWishlist: jest.fn(),
  }),
}));

jest.mock('react-star-ratings', () => {
  return function MockStarRatings({ rating }) {
    return <div data-testid="product-rating">Rating: {rating}</div>;
  };
});

const product = {
  _id: 'prod_1',
  name: 'Classic Sneakers',
  price: 99.99,
  category: 'footwear',
  images: [{ url: '/images/sneakers.jpg' }],
  ratings: 4.5,
  stock: 20,
  seller: 'Nike',
  description: 'Comfortable everyday sneakers.',
};

function renderProductItem(customProduct = product) {
  return render(
    <CartContext.Provider
      value={{
        cart: { cartItems: [] },
        addItemToCart: mockAddItemToCart,
        deleteItemFromCart: jest.fn(),
        clearCart: jest.fn(),
      }}
    >
      <ProductItem product={customProduct} />
    </CartContext.Provider>
  );
}

describe('ProductItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsInWishlist.mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders product name and price', () => {
    renderProductItem();

    expect(screen.getByText('Classic Sneakers')).toBeInTheDocument();
    expect(screen.getByText(/99[,.]99/)).toBeInTheDocument();
  });

  it('renders the product image', () => {
    renderProductItem();

    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('sneakers.jpg'));
  });

  it('calls addItemToCart with the product when the button is clicked', async () => {
    const user = userEvent.setup();

    renderProductItem();

    const button = screen.getByRole('button', { name: /add to cart/i });
    await user.click(button);

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

  it('renders product detail link with the correct href', () => {
    renderProductItem();

    const link = screen.getByRole('link', { name: /classic sneakers/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/productList/prod_1');
  });

  it('displays rating stars', () => {
    renderProductItem();

    expect(screen.getByTestId('product-rating')).toBeInTheDocument();
    expect(screen.getByText(/Rating: 4\.5/)).toBeInTheDocument();
  });

  it('calls toggleWishlist when the wishlist button is clicked', async () => {
    const user = userEvent.setup();

    renderProductItem();

    const wishlistButton = screen.getByRole('button', {
      name: /add to wishlist/i,
    });

    await user.click(wishlistButton);

    expect(mockToggleWishlist).toHaveBeenCalledTimes(1);
    expect(mockToggleWishlist).toHaveBeenCalledWith(product);
  });
});
