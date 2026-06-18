/**
 * Coverage for zero-percent UI files:
 * Checkout, Breadcrumbs, ProductReviews, SimilarItems, SimilarProductCard,
 * SingleProductDetail, BackToTop, Footer, Hero, HeroAnimation, NavBar, Search,
 * OrderList, OrderDetails, ProductList, ProductListPage.
 */
import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

import Checkout from '@/app/checkout/Checkout';
import BreadCrumbs from '@/app/clientComponent/BreadCrumbs';
import ProductReviews from '@/app/clientComponent/ProductReviews';
import SimilarItems from '@/app/clientComponent/SimilarItems';
import SimilarProductCard from '@/app/clientComponent/SimilarProductCard';
import SingleProductDetail from '@/app/clientComponent/SingleProductDetail';
import BackToTop from '@/app/components/BackToTop';
import Footer from '@/app/components/footer/Footer';
import Hero from '@/app/components/hero/Hero';
import HeroAnimation from '@/app/components/hero/HeroAnimation';
import NavBar from '@/app/components/nav/NavBar';
import Search from '@/app/components/nav/Search';
import CartContext from '@/app/context/CartContext';
import OrderList from '@/app/orderlist/OrderList';
import OrderDetails from '@/app/orders/[id]/OrderDetails';
import ProductList from '@/app/productList/ProductList';
import ProductListPage from '@/app/productList/ProductListPage';

const mockPush = jest.fn();
const mockRouter = { push: mockPush };

let mockSearchParams = '';
let mockFirebaseValue = { user: null, loading: false, handleSignOut: jest.fn() };

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(mockSearchParams),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }) => (
    <a href={typeof href === 'string' ? href : '#'} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt = '', ...props }) => (
    <img src={typeof src === 'string' ? src : '/mock.png'} alt={alt} {...props} />
  ),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('query-string', () => ({
  __esModule: true,
  default: {
    stringify: (params) =>
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&'),
  },
}));

jest.mock('react-star-ratings', () => ({
  __esModule: true,
  default: ({ rating = 0 }) => <span data-testid="star-ratings">rating-{rating}</span>,
}));

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: ({ animationData }) => (
    <div data-testid="lottie">{animationData ? 'has-animation' : 'no-animation'}</div>
  ),
}));

jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
}));

jest.mock('swiper/modules', () => ({
  Autoplay: {},
  Navigation: {},
}));

jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));

jest.mock('react-paginate', () => ({
  __esModule: true,
  default: ({ onPageChange, pageCount }) => (
    <button type="button" data-testid="paginate" onClick={() => onPageChange({ selected: 1 })}>
      paginate-{pageCount}
    </button>
  ),
}));

jest.mock('@/app/context/FirebaseContext', () => ({
  useFirebaseAppContext: () => mockFirebaseValue,
}));

jest.mock('@/app/context/WishlistContext', () => ({
  useWishlist: () => ({
    wishlist: { wishlistItems: [] },
    isInWishlist: jest.fn(() => false),
    toggleWishlist: jest.fn(),
  }),
}));

jest.mock('@/app/context/CartContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.createContext({
      cart: { cartItems: [] },
      addItemToCart: jest.fn(),
      clearCart: jest.fn(),
    }),
  };
});

const product = {
  _id: 'p1',
  name: 'Gaming Laptop Super Fast',
  description: 'A good laptop for testing',
  price: 15000000,
  seller: 'Dell',
  stock: 5,
  ratings: 4.5,
  category: 'Electronics',
  images: [{ url: '/laptop-1.png' }, { url: '/laptop-2.png' }],
};

const cartItem = {
  product: 'p1',
  name: 'Gaming Laptop',
  price: 1000,
  image: '/laptop.png',
  quantity: 2,
  seller: 'Dell',
  stock: 5,
};

const jsonResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
  json: jest.fn().mockResolvedValue(data),
});

beforeEach(() => {
  jest.clearAllMocks();
  mockPush.mockClear();
  mockSearchParams = '';
  mockFirebaseValue = { user: null, loading: false, handleSignOut: jest.fn() };
  global.fetch = jest.fn();
  window.alert = jest.fn();
  window.scrollTo = jest.fn();
});

describe('small presentational components', () => {
  it('renders BreadCrumbs links', () => {
    render(
      <BreadCrumbs
        breadCrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/productList' },
        ]}
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('renders SimilarProductCard content', () => {
    render(<SimilarProductCard similarProduct={product} />);

    expect(screen.getByText(/Gaming Laptop/i)).toBeInTheDocument();
    expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();
    expect(screen.getByTestId('star-ratings')).toHaveTextContent('rating-4.5');
  });

  it('renders SimilarItems filtered by category', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <SimilarItems
        productCateogary="Electronics"
        allProductData={[
          product,
          { ...product, _id: 'p2', name: 'Keyboard', category: 'Electronics' },
          { ...product, _id: 'p3', name: 'Shoes', category: 'Fashion' },
        ]}
      />
    );

    expect(screen.getByText(/similar electronics items/i)).toBeInTheDocument();
    expect(screen.getByText(/Gaming Laptop/i)).toBeInTheDocument();
    expect(screen.getByText(/Keyboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Shoes/i)).not.toBeInTheDocument();
  });

  it('renders Footer links and copyright', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /About Us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Products$/i })).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it('renders Hero carousel and HeroAnimation', () => {
    const { unmount } = render(<Hero />);
    expect(screen.getByTestId('swiper')).toBeInTheDocument();
    unmount();

    render(<HeroAnimation />);
    expect(screen.getByTestId('lottie')).toHaveTextContent('has-animation');
  });
});

describe('BackToTop', () => {
  it('shows button after scroll and scrolls to top when clicked', () => {
    render(<BackToTop />);
    expect(screen.queryByLabelText(/Kembali ke atas/i)).not.toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
    fireEvent.scroll(window);

    const button = screen.getByLabelText(/Kembali ke atas/i);
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

describe('NavBar and Search', () => {
  it('renders cart count and signed in user', () => {
    mockFirebaseValue = {
      user: { displayName: 'Gusti' },
      loading: false,
      handleSignOut: jest.fn(),
    };

    render(
      <CartContext.Provider
        value={{ cart: { cartItems: [cartItem, { ...cartItem, product: 'p2' }] } }}
      >
        <NavBar />
      </CartContext.Provider>
    );

    expect(screen.getByRole('link', { name: /Cart/i })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Gusti')).toBeInTheDocument();
  });

  it('renders sign in link when user is not authenticated', () => {
    render(
      <CartContext.Provider value={{ cart: { cartItems: [] } }}>
        <NavBar />
      </CartContext.Provider>
    );

    expect(screen.getByText(/Sign in\s*\/\s*Sign up/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Cart/i })).toBeInTheDocument();
  });

  it('Search pushes keyword route and empty route', () => {
    const { container, rerender } = render(<Search />);
    const input = container.querySelector('input');

    fireEvent.change(input, { target: { value: '  laptop ' } });
    fireEvent.submit(input.closest('form'));

    expect(mockPush).toHaveBeenCalledWith('/productList?keyword=laptop');

    mockSearchParams = 'keyword=mouse';
    rerender(<Search />);
    fireEvent.change(container.querySelector('input'), { target: { value: '   ' } });
    fireEvent.submit(container.querySelector('form'));

    expect(mockPush).toHaveBeenCalledWith('/productList');
  });
});

describe('SingleProductDetail', () => {
  it('renders product details, changes preview image, and adds to cart', () => {
    const addItemToCart = jest.fn();
    const { container } = render(
      <CartContext.Provider value={{ addItemToCart }}>
        <SingleProductDetail singleProductData={product} />
      </CartContext.Provider>
    );

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(/In Stock/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();

    const thumbnails = container.querySelectorAll('img');
    if (thumbnails.length > 1) {
      fireEvent.click(thumbnails[1]);
    }

    fireEvent.click(screen.getByText(/Add to Cart/i));
    expect(addItemToCart).toHaveBeenCalledWith(
      expect.objectContaining({ product: 'p1', name: product.name, seller: 'Dell' })
    );
  });

  it('renders out of stock branch', () => {
    render(
      <CartContext.Provider value={{ addItemToCart: jest.fn() }}>
        <SingleProductDetail singleProductData={{ ...product, stock: 0 }} />
      </CartContext.Provider>
    );

    expect(screen.getByText(/Out of Stock/i)).toBeInTheDocument();
  });
});

describe('ProductReviews', () => {
  it('fetches, displays, validates, and submits reviews', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          singleProductDetail: {
            ratings: 4,
            reviews: [{ _id: 'r1', name: 'Gusti', rating: 4, comment: 'Good product' }],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          singleProductDetail: {
            ratings: 5,
            reviews: [{ _id: 'r2', name: 'Tester', rating: 5, comment: 'Great' }],
          },
        },
      });
    axios.post.mockResolvedValue({ data: { success: true } });

    const { container } = render(
      <ProductReviews productId="p1" initialReviews={[]} initialRating={0} />
    );

    expect(await screen.findByText(/Good product/i)).toBeInTheDocument();

    fireEvent.submit(container.querySelector('form'));
    expect(await screen.findByText(/Review tidak boleh kosong/i)).toBeInTheDocument();

    const inputs = container.querySelectorAll('input');
    const textarea = container.querySelector('textarea');
    fireEvent.change(inputs[0], { target: { value: 'Tester' } });
    fireEvent.change(textarea, { target: { value: 'Great' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        '/api/product/p1',
        expect.objectContaining({ name: 'Tester', rating: 5, comment: 'Great' })
      )
    );
    expect(await screen.findByText(/Great/i)).toBeInTheDocument();
  });

  it('shows fetch and submit errors', async () => {
    axios.get.mockRejectedValueOnce(new Error('network'));
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Cannot submit review' } } });

    const { container } = render(
      <ProductReviews productId="p1" initialReviews={[]} initialRating={0} />
    );

    expect(await screen.findByText(/Gagal mengambil review/i)).toBeInTheDocument();

    fireEvent.change(container.querySelector('textarea'), { target: { value: 'Valid comment' } });
    fireEvent.submit(container.querySelector('form'));

    expect(await screen.findByText(/Cannot submit review/i)).toBeInTheDocument();
  });
});

describe('Checkout', () => {
  it('renders empty cart state', () => {
    render(
      <CartContext.Provider value={{ cart: { cartItems: [] }, clearCart: jest.fn() }}>
        <Checkout />
      </CartContext.Provider>
    );

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to shop/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated user before placing order', () => {
    render(
      <CartContext.Provider value={{ cart: { cartItems: [cartItem] }, clearCart: jest.fn() }}>
        <Checkout />
      </CartContext.Provider>
    );

    fireEvent.click(screen.getByText(/Place Order/i));

    expect(window.alert).toHaveBeenCalledWith('Please login first before placing an order.');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('validates required shipping fields', async () => {
    mockFirebaseValue = {
      loading: false,
      user: { getIdToken: jest.fn().mockResolvedValue('token') },
      handleSignOut: jest.fn(),
    };

    render(
      <CartContext.Provider value={{ cart: { cartItems: [cartItem] }, clearCart: jest.fn() }}>
        <Checkout />
      </CartContext.Provider>
    );

    fireEvent.click(screen.getByText(/Place Order/i));

    expect(await screen.findByText(/Full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
  });

  it('places COD order successfully and clears cart', async () => {
    const clearCart = jest.fn().mockResolvedValue(undefined);
    mockFirebaseValue = {
      loading: false,
      user: { getIdToken: jest.fn().mockResolvedValue('token') },
      handleSignOut: jest.fn(),
    };
    global.fetch.mockResolvedValue(jsonResponse({ order: { _id: 'order-1' } }, 201));

    const { container } = render(
      <CartContext.Provider value={{ cart: { cartItems: [cartItem] }, clearCart }}>
        <Checkout />
      </CartContext.Provider>
    );

    fireEvent.change(container.querySelector('input[name="fullName"]'), {
      target: { value: 'Gusti Gratia' },
    });
    fireEvent.change(container.querySelector('input[name="phone"]'), {
      target: { value: '081234567890' },
    });
    fireEvent.change(container.querySelector('textarea[name="address"]'), {
      target: { value: 'Jl. Testing Panjang Nomor 1' },
    });
    fireEvent.change(container.querySelector('input[name="city"]'), {
      target: { value: 'Surabaya' },
    });
    fireEvent.change(container.querySelector('input[name="postalCode"]'), {
      target: { value: '60111' },
    });
    fireEvent.change(container.querySelector('input[name="country"]'), {
      target: { value: 'Indonesia' },
    });

    fireEvent.click(screen.getByText(/Place Order/i));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/orders',
        expect.objectContaining({ method: 'POST' })
      )
    );
    expect(clearCart).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/orders/order-1');
  });

  it('validates card payment fields and handles API failure', async () => {
    mockFirebaseValue = {
      loading: false,
      user: { getIdToken: jest.fn().mockResolvedValue('token') },
      handleSignOut: jest.fn(),
    };
    global.fetch.mockResolvedValue(jsonResponse({ message: 'Failed to place order' }, 400));

    const { container } = render(
      <CartContext.Provider value={{ cart: { cartItems: [cartItem] }, clearCart: jest.fn() }}>
        <Checkout />
      </CartContext.Provider>
    );

    fireEvent.change(container.querySelector('input[name="fullName"]'), {
      target: { value: 'Gusti Gratia' },
    });
    fireEvent.change(container.querySelector('input[name="phone"]'), {
      target: { value: '081234567890' },
    });
    fireEvent.change(container.querySelector('textarea[name="address"]'), {
      target: { value: 'Jl. Testing Panjang Nomor 1' },
    });
    fireEvent.change(container.querySelector('input[name="city"]'), {
      target: { value: 'Surabaya' },
    });
    fireEvent.change(container.querySelector('input[name="postalCode"]'), {
      target: { value: '60111' },
    });
    fireEvent.change(container.querySelector('input[name="country"]'), {
      target: { value: 'Indonesia' },
    });
    fireEvent.click(screen.getByText(/Credit \/ Debit Card/i));
    fireEvent.click(screen.getByText(/Place Order/i));

    expect(await screen.findByText(/Card number is required/i)).toBeInTheDocument();

    fireEvent.change(container.querySelector('input[name="cardNumber"]'), {
      target: { value: '1234567812345678' },
    });
    fireEvent.change(container.querySelector('input[name="cardName"]'), {
      target: { value: 'Gusti Gratia' },
    });
    fireEvent.change(container.querySelector('input[name="expiryDate"]'), {
      target: { value: '12/99' },
    });
    fireEvent.change(container.querySelector('input[name="cvv"]'), { target: { value: '123' } });
    fireEvent.click(screen.getByText(/Place Order/i));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Failed to place order'));
  });
});

describe('OrderList and OrderDetails', () => {
  const order = {
    _id: 'order-abcdef',
    createdAt: '2026-06-15T00:00:00.000Z',
    orderStatus: 'Processing',
    totalAmount: 1150,
    amountWithoutTax: 1000,
    taxAmount: 150,
    paymentInfo: { method: 'Card', cardLast4: '5678' },
    shippingInfo: {
      fullName: 'Gusti Gratia',
      phone: '081234567890',
      address: 'Jl. Testing No. 1',
      city: 'Surabaya',
      postalCode: '60111',
      country: 'Indonesia',
    },
    orderItems: [cartItem],
  };

  it('OrderList redirects to login when user is missing', async () => {
    render(<OrderList />);

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('OrderList fetches and displays orders', async () => {
    mockFirebaseValue = {
      loading: false,
      user: { email: 'gusti@example.com', getIdToken: jest.fn().mockResolvedValue('token') },
      handleSignOut: jest.fn(),
    };
    global.fetch.mockResolvedValue(jsonResponse({ orders: [order] }));

    render(<OrderList />);

    expect(await screen.findByRole('heading', { name: /My Orders/i })).toBeInTheDocument();

    expect(screen.getByText(/#ABCDEF/i)).toBeInTheDocument();
    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Detail/i })).toBeInTheDocument();
  });

  it('OrderList shows empty state and error state', async () => {
    mockFirebaseValue = {
      loading: false,
      user: { email: 'gusti@example.com', getIdToken: jest.fn().mockResolvedValue('token') },
      handleSignOut: jest.fn(),
    };
    global.fetch.mockResolvedValueOnce(jsonResponse({ orders: [] }));

    const { unmount } = render(<OrderList />);
    expect(await screen.findByText(/No orders found/i)).toBeInTheDocument();
    unmount();

    global.fetch.mockResolvedValueOnce(jsonResponse({ message: 'failed' }, 500));
    render(<OrderList />);
    expect(await screen.findByText(/Failed to load orders/i)).toBeInTheDocument();
  });

  it('OrderDetails fetches and displays order detail', async () => {
    mockFirebaseValue = {
      loading: false,
      user: { getIdToken: jest.fn().mockResolvedValue('token') },
      handleSignOut: jest.fn(),
    };
    global.fetch.mockResolvedValue(jsonResponse({ order }));

    render(<OrderDetails orderId="order-abcdef" />);

    expect(await screen.findByText(/Order Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Thank you/i)).toBeInTheDocument();
    expect(screen.getByText(/Gaming Laptop/i)).toBeInTheDocument();
    expect(screen.getByText(/Gusti Gratia/i)).toBeInTheDocument();
    expect(screen.getByText(/\*\*\*\* 5678/i)).toBeInTheDocument();
  });

  it('OrderDetails shows login error and API error', async () => {
    render(<OrderDetails orderId="order-abcdef" />);
    expect(await screen.findByText(/Please login first/i)).toBeInTheDocument();

    mockFirebaseValue = {
      loading: false,
      user: { getIdToken: jest.fn().mockResolvedValue('token') },
      handleSignOut: jest.fn(),
    };
    global.fetch.mockResolvedValue(jsonResponse({ message: 'Order not found' }, 404));

    render(<OrderDetails orderId="missing" />);
    expect(await screen.findByText(/Order not found/i)).toBeInTheDocument();
  });
});

describe('ProductList and ProductListPage', () => {
  it('ProductList renders products', () => {
    render(<ProductList allProductData={{ products: [product] }} />);

    expect(screen.getByText(/Gaming Laptop/i)).toBeInTheDocument();
  });

  it('ProductListPage fetches product data and handles pagination', async () => {
    axios.get.mockResolvedValue({
      data: {
        products: [product],
        totalPages: 2,
      },
    });

    render(<ProductListPage />);

    expect(await screen.findByText(/Gaming Laptop/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('paginate'));

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/product?'))
    );
  });

  it('ProductListPage logs fetch error without crashing', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('network'));

    render(<ProductListPage />);

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith('Error fetching product data:', expect.any(Error))
    );
  });
});
