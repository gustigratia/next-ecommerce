/**
 * Integration Tests — ProductCard component
 *
 * Renders the card with realistic props and asserts user-visible behaviour
 * (clicking "Add to Cart", navigating to the detail page, etc.).
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock cart context / store
const mockAddToCart = jest.fn();
jest.mock('@/context/CartContext', () => ({
  useCart: () => ({ addToCart: mockAddToCart, cart: [] }),
}));

// Lazy import after mocks
let ProductCard;
beforeAll(async () => {
  const mod = await import('@/components/ProductCard');
  ProductCard = mod.default;
});

const product = {
  _id: 'prod_1',
  title: 'Classic Sneakers',
  price: 99.99,
  category: 'footwear',
  image: '/images/sneakers.jpg',
  rating: 4.5,
  description: 'Comfortable everyday sneakers.',
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product title and price', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText('Classic Sneakers')).toBeInTheDocument();
    expect(screen.getByText(/99\.99/)).toBeInTheDocument();
  });

  it('renders the product image with correct alt text', () => {
    render(<ProductCard product={product} />);

    const img = screen.getByRole('img', { name: /classic sneakers/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('sneakers'));
  });

  it('calls addToCart with the product when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={product} />);

    const btn = screen.getByRole('button', { name: /add to cart/i });
    await user.click(btn);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 'prod_1', title: 'Classic Sneakers' })
    );
  });

  it('navigates to the product detail page on card click', async () => {
    const { useRouter } = await import('next/navigation');
    const pushMock = useRouter().push;

    const user = userEvent.setup();
    render(<ProductCard product={product} />);

    // Click on the card title or image (not the button)
    await user.click(screen.getByText('Classic Sneakers'));

    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('prod_1'));
  });

  it('displays rating stars', () => {
    render(<ProductCard product={product} />);
    // react-star-ratings renders star elements; check an aria-label or data-testid
    const ratingEl = screen.getByTestId('product-rating');
    expect(ratingEl).toBeInTheDocument();
  });
});
