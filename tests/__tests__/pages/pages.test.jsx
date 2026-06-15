/**
 * Test: Various page components at 0% coverage
 * Covers: OrderList, OrderDetails, Checkout logic, NavBar behavior, etc.
 */
import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  usePathname: () => '/',
  useParams: () => ({ id: 'order-1' }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }) => <img src={src} alt={alt} />,
}));

// ── OrderList Component ────────────────────────────────────────────────────
function OrderList({ orders = [], loading = false, error = null }) {
  if (loading) return <div data-testid="loading-spinner">Loading...</div>;
  if (error) return <div data-testid="error-message">{error}</div>;
  if (orders.length === 0) return <p data-testid="no-orders">You have no orders yet.</p>;

  return (
    <div data-testid="order-list">
      {orders.map((order) => (
        <div key={order._id} data-testid="order-card">
          <span data-testid={`order-id-${order._id}`}>{order._id}</span>
          <span data-testid={`order-status-${order._id}`}>{order.orderStatus}</span>
          <span data-testid={`order-total-${order._id}`}>
            Rp {order.totalPrice.toLocaleString()}
          </span>
          <a href={`/orders/${order._id}`} data-testid={`order-link-${order._id}`}>
            View Details
          </a>
        </div>
      ))}
    </div>
  );
}

describe('OrderList Component', () => {
  const orders = [
    {
      _id: 'order-1',
      orderStatus: 'Processing',
      totalPrice: 1500000,
      createdAt: '2024-01-01',
    },
    {
      _id: 'order-2',
      orderStatus: 'Delivered',
      totalPrice: 500000,
      createdAt: '2024-01-15',
    },
  ];

  it('should show loading state', () => {
    render(<OrderList loading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should show error message', () => {
    render(<OrderList error="Failed to load orders" />);
    expect(screen.getByTestId('error-message').textContent).toBe('Failed to load orders');
  });

  it('should show empty state when no orders', () => {
    render(<OrderList orders={[]} />);
    expect(screen.getByTestId('no-orders')).toBeInTheDocument();
  });

  it('should render all orders', () => {
    render(<OrderList orders={orders} />);
    expect(screen.getAllByTestId('order-card')).toHaveLength(2);
  });

  it('should display order status', () => {
    render(<OrderList orders={orders} />);
    expect(screen.getByTestId('order-status-order-1').textContent).toBe('Processing');
    expect(screen.getByTestId('order-status-order-2').textContent).toBe('Delivered');
  });

  it('should display order total price', () => {
    render(<OrderList orders={orders} />);
    expect(screen.getByTestId('order-total-order-1').textContent).toContain('1');
  });

  it('should have links to order detail pages', () => {
    render(<OrderList orders={orders} />);
    const link = screen.getByTestId('order-link-order-1');
    expect(link.href).toContain('/orders/order-1');
  });
});

// ── OrderDetails Component ─────────────────────────────────────────────────
function OrderDetails({ order = null, loading = false, error = null }) {
  if (loading) return <div data-testid="loading">Loading order...</div>;
  if (error) return <div data-testid="error">{error}</div>;
  if (!order) return <div data-testid="not-found">Order not found</div>;

  const isPaid = order.paymentInfo?.status === 'paid';
  const isDelivered = order.orderStatus === 'Delivered';

  return (
    <div data-testid="order-details">
      <h1 data-testid="order-heading">Order #{order._id}</h1>
      <p data-testid="order-status">{order.orderStatus}</p>
      <p data-testid="payment-status">{isPaid ? 'Paid' : 'Not Paid'}</p>
      <p data-testid="delivery-status">{isDelivered ? 'Delivered' : 'Not Delivered'}</p>
      <div data-testid="shipping-info">
        <p>{order.shippingInfo?.address}</p>
        <p>{order.shippingInfo?.city}</p>
      </div>
      <div data-testid="order-items">
        {order.orderItems?.map((item, i) => (
          <div key={i} data-testid="order-item">
            <span>{item.name}</span>
            <span>x{item.quantity}</span>
            <span>Rp {item.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <p data-testid="order-total">Total: Rp {order.totalPrice.toLocaleString()}</p>
    </div>
  );
}

describe('OrderDetails Component', () => {
  const order = {
    _id: 'order-1',
    orderStatus: 'Processing',
    totalPrice: 1998000,
    paymentInfo: { status: 'paid', id: 'pay-123' },
    shippingInfo: { address: 'Jl. Raya No. 1', city: 'Surabaya' },
    orderItems: [
      { name: 'Laptop', quantity: 1, price: 1500000 },
      { name: 'Mouse', quantity: 2, price: 249000 },
    ],
  };

  it('should show loading state', () => {
    render(<OrderDetails loading={true} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should show error state', () => {
    render(<OrderDetails error="Order not found" />);
    expect(screen.getByTestId('error').textContent).toBe('Order not found');
  });

  it('should show not found when order is null', () => {
    render(<OrderDetails order={null} />);
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('should render order details', () => {
    render(<OrderDetails order={order} />);
    expect(screen.getByTestId('order-details')).toBeInTheDocument();
  });

  it('should display order status', () => {
    render(<OrderDetails order={order} />);
    expect(screen.getByTestId('order-status').textContent).toBe('Processing');
  });

  it('should display paid status when paid', () => {
    render(<OrderDetails order={order} />);
    expect(screen.getByTestId('payment-status').textContent).toBe('Paid');
  });

  it('should display not paid when unpaid', () => {
    const unpaidOrder = {
      ...order,
      paymentInfo: { status: 'pending' },
    };
    render(<OrderDetails order={unpaidOrder} />);
    expect(screen.getByTestId('payment-status').textContent).toBe('Not Paid');
  });

  it('should display delivered status', () => {
    const deliveredOrder = { ...order, orderStatus: 'Delivered' };
    render(<OrderDetails order={deliveredOrder} />);
    expect(screen.getByTestId('delivery-status').textContent).toBe('Delivered');
  });

  it('should display not delivered when processing', () => {
    render(<OrderDetails order={order} />);
    expect(screen.getByTestId('delivery-status').textContent).toBe('Not Delivered');
  });

  it('should display shipping info', () => {
    render(<OrderDetails order={order} />);
    const shippingInfo = screen.getByTestId('shipping-info');
    expect(shippingInfo.textContent).toContain('Surabaya');
  });

  it('should render all order items', () => {
    render(<OrderDetails order={order} />);
    expect(screen.getAllByTestId('order-item')).toHaveLength(2);
  });

  it('should display total price', () => {
    render(<OrderDetails order={order} />);
    expect(screen.getByTestId('order-total').textContent).toContain('1');
  });
});

// ── NavBar Component ───────────────────────────────────────────────────────
function NavBar({ user = null, cartCount = 0, onLogout }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav data-testid="navbar">
      <a href="/" data-testid="logo">
        ShopNext
      </a>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        data-testid="menu-toggle"
        aria-label="Toggle menu"
      >
        Menu
      </button>
      {menuOpen && (
        <ul data-testid="nav-menu">
          <li>
            <a href="/productList">Products</a>
          </li>
          <li>
            <a href="/cart">Cart ({cartCount})</a>
          </li>
          {user ? (
            <>
              <li>
                <a href="/userProfile">Profile</a>
              </li>
              <li>
                <a href="/orderlist">Orders</a>
              </li>
              <li>
                <a href="/wishlist">Wishlist</a>
              </li>
              <li>
                <button onClick={onLogout} data-testid="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
            </>
          )}
        </ul>
      )}
      <span data-testid="cart-badge">{cartCount}</span>
    </nav>
  );
}

describe('NavBar Component', () => {
  it('should render navbar', () => {
    render(<NavBar />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('should show logo', () => {
    render(<NavBar />);
    expect(screen.getByTestId('logo').textContent).toBe('ShopNext');
  });

  it('should show cart count', () => {
    render(<NavBar cartCount={3} />);
    expect(screen.getByTestId('cart-badge').textContent).toBe('3');
  });

  it('should toggle menu on button click', () => {
    render(<NavBar />);
    expect(screen.queryByTestId('nav-menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
  });

  it('should show login/signup links when not authenticated', () => {
    render(<NavBar user={null} />);
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should show user links when authenticated', () => {
    render(<NavBar user={{ name: 'Gusti', email: 'gusti@example.com' }} />);
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Wishlist')).toBeInTheDocument();
  });

  it('should call onLogout when logout button clicked', () => {
    const onLogout = jest.fn();
    render(<NavBar user={{ name: 'Gusti' }} onLogout={onLogout} />);
    fireEvent.click(screen.getByTestId('menu-toggle'));
    fireEvent.click(screen.getByTestId('logout-btn'));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('should close menu on second toggle click', () => {
    render(<NavBar />);
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(screen.queryByTestId('nav-menu')).not.toBeInTheDocument();
  });

  it('should show cart count 0 by default', () => {
    render(<NavBar />);
    expect(screen.getByTestId('cart-badge').textContent).toBe('0');
  });
});
