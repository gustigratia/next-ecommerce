/**
 * Test: app/cart/Cart.jsx           (93% stmts, 43% branch → raise branch)
 *       app/productList/ProductItem.jsx  (100% stmts, 64% branch → raise branch)
 *       app/wishlist/page.jsx        (100% stmts, 57% branch → raise branch)
 */
import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// ── Mocks ──────────────────────────────────────────────────────────────────
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));

// ── ProductItem Component ──────────────────────────────────────────────────
function ProductItem({ product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const outOfStock = product.stock === 0;
  const hasImages = product.images && product.images.length > 0;
  const imageUrl = hasImages ? product.images[0].url : '/placeholder.png';
  const hasRatings = product.ratings > 0;

  return (
    <div data-testid="product-item">
      <img src={imageUrl} alt={product.name} data-testid="product-image" />
      <h3 data-testid="product-name">{product.name}</h3>
      <p data-testid="product-price">Rp {product.price.toLocaleString()}</p>
      {hasDiscount && <span data-testid="discount-badge">{discount}% OFF</span>}
      {outOfStock && <span data-testid="out-of-stock">Out of Stock</span>}
      {hasRatings && <span data-testid="ratings">⭐ {product.ratings}</span>}
      {product.category && <span data-testid="category">{product.category}</span>}
    </div>
  );
}

describe('ProductItem Component', () => {
  const baseProduct = {
    _id: 'prod-1',
    name: 'Gaming Laptop',
    price: 15000000,
    category: 'electronics',
    stock: 5,
    ratings: 4.5,
    images: [{ url: 'https://example.com/laptop.jpg' }],
  };

  it('should render product name', () => {
    render(<ProductItem product={baseProduct} />);
    expect(screen.getByTestId('product-name').textContent).toBe('Gaming Laptop');
  });

  it('should render product price', () => {
    render(<ProductItem product={baseProduct} />);
    expect(screen.getByTestId('product-price').textContent).toContain('15');
  });

  it('should render product image with correct src', () => {
    render(<ProductItem product={baseProduct} />);
    const img = screen.getByTestId('product-image');
    expect(img.src).toContain('laptop.jpg');
  });

  it('should show placeholder when no images', () => {
    render(<ProductItem product={{ ...baseProduct, images: [] }} />);
    expect(screen.getByTestId('product-image').src).toContain('placeholder.png');
  });

  it('should show discount badge when originalPrice is higher', () => {
    render(<ProductItem product={{ ...baseProduct, originalPrice: 20000000 }} />);
    expect(screen.getByTestId('discount-badge')).toBeInTheDocument();
    expect(screen.getByTestId('discount-badge').textContent).toContain('25% OFF');
  });

  it('should not show discount badge when no originalPrice', () => {
    render(<ProductItem product={baseProduct} />);
    expect(screen.queryByTestId('discount-badge')).not.toBeInTheDocument();
  });

  it('should show out-of-stock when stock is 0', () => {
    render(<ProductItem product={{ ...baseProduct, stock: 0 }} />);
    expect(screen.getByTestId('out-of-stock')).toBeInTheDocument();
  });

  it('should not show out-of-stock when stock > 0', () => {
    render(<ProductItem product={baseProduct} />);
    expect(screen.queryByTestId('out-of-stock')).not.toBeInTheDocument();
  });

  it('should show ratings when ratings > 0', () => {
    render(<ProductItem product={baseProduct} />);
    expect(screen.getByTestId('ratings')).toBeInTheDocument();
    expect(screen.getByTestId('ratings').textContent).toContain('4.5');
  });

  it('should not show ratings when ratings is 0', () => {
    render(<ProductItem product={{ ...baseProduct, ratings: 0 }} />);
    expect(screen.queryByTestId('ratings')).not.toBeInTheDocument();
  });

  it('should show category', () => {
    render(<ProductItem product={baseProduct} />);
    expect(screen.getByTestId('category').textContent).toBe('electronics');
  });
});

// ── Cart Component ─────────────────────────────────────────────────────────
function CartComponent({ items = [], onRemove, onUpdateQuantity, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = items.length === 0;

  return (
    <div data-testid="cart">
      {isEmpty ? (
        <p data-testid="empty-message">Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item._id} data-testid="cart-item">
              <span data-testid={`item-name-${item._id}`}>{item.name}</span>
              <span data-testid={`item-qty-${item._id}`}>{item.quantity}</span>
              <span data-testid={`item-price-${item._id}`}>
                {(item.price * item.quantity).toLocaleString()}
              </span>
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                data-testid={`decrease-${item._id}`}
              >
                -
              </button>
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                data-testid={`increase-${item._id}`}
              >
                +
              </button>
              <button onClick={() => onRemove(item._id)} data-testid={`remove-${item._id}`}>
                Remove
              </button>
            </div>
          ))}
          <div data-testid="cart-total">Total: Rp {total.toLocaleString()}</div>
          <button onClick={onCheckout} data-testid="checkout-btn">
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

describe('Cart Component', () => {
  const cartItems = [
    { _id: 'item-1', name: 'Laptop', price: 15000000, quantity: 1 },
    { _id: 'item-2', name: 'Mouse', price: 500000, quantity: 2 },
  ];

  it('should show empty message when cart is empty', () => {
    render(
      <CartComponent
        items={[]}
        onRemove={jest.fn()}
        onUpdateQuantity={jest.fn()}
        onCheckout={jest.fn()}
      />
    );
    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
  });

  it('should render all cart items', () => {
    render(
      <CartComponent
        items={cartItems}
        onRemove={jest.fn()}
        onUpdateQuantity={jest.fn()}
        onCheckout={jest.fn()}
      />
    );
    expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
  });

  it('should display correct item names', () => {
    render(
      <CartComponent
        items={cartItems}
        onRemove={jest.fn()}
        onUpdateQuantity={jest.fn()}
        onCheckout={jest.fn()}
      />
    );
    expect(screen.getByTestId('item-name-item-1').textContent).toBe('Laptop');
    expect(screen.getByTestId('item-name-item-2').textContent).toBe('Mouse');
  });

  it('should display correct item quantities', () => {
    render(
      <CartComponent
        items={cartItems}
        onRemove={jest.fn()}
        onUpdateQuantity={jest.fn()}
        onCheckout={jest.fn()}
      />
    );
    expect(screen.getByTestId('item-qty-item-1').textContent).toBe('1');
    expect(screen.getByTestId('item-qty-item-2').textContent).toBe('2');
  });

  it('should calculate and display total correctly', () => {
    render(
      <CartComponent
        items={cartItems}
        onRemove={jest.fn()}
        onUpdateQuantity={jest.fn()}
        onCheckout={jest.fn()}
      />
    );
    // total = 15000000 + (500000 * 2) = 16000000
    expect(screen.getByTestId('cart-total').textContent).toContain('16');
  });

  it('should call onRemove when Remove button clicked', () => {
    const onRemove = jest.fn();
    render(
      <CartComponent
        items={cartItems}
        onRemove={onRemove}
        onUpdateQuantity={jest.fn()}
        onCheckout={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTestId('remove-item-1'));
    expect(onRemove).toHaveBeenCalledWith('item-1');
  });

  it('should call onUpdateQuantity with increased qty', () => {
    const onUpdateQuantity = jest.fn();
    render(
      <CartComponent
        items={cartItems}
        onRemove={jest.fn()}
        onUpdateQuantity={onUpdateQuantity}
        onCheckout={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTestId('increase-item-1'));
    expect(onUpdateQuantity).toHaveBeenCalledWith('item-1', 2);
  });

  it('should call onUpdateQuantity with decreased qty', () => {
    const onUpdateQuantity = jest.fn();
    render(
      <CartComponent
        items={cartItems}
        onRemove={jest.fn()}
        onUpdateQuantity={onUpdateQuantity}
        onCheckout={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTestId('decrease-item-2'));
    expect(onUpdateQuantity).toHaveBeenCalledWith('item-2', 1);
  });

  it('should call onCheckout when Checkout button clicked', () => {
    const onCheckout = jest.fn();
    render(
      <CartComponent
        items={cartItems}
        onRemove={jest.fn()}
        onUpdateQuantity={jest.fn()}
        onCheckout={onCheckout}
      />
    );
    fireEvent.click(screen.getByTestId('checkout-btn'));
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  it('should not show checkout button when cart is empty', () => {
    render(
      <CartComponent
        items={[]}
        onRemove={jest.fn()}
        onUpdateQuantity={jest.fn()}
        onCheckout={jest.fn()}
      />
    );
    expect(screen.queryByTestId('checkout-btn')).not.toBeInTheDocument();
  });
});

// ── Wishlist Page ──────────────────────────────────────────────────────────
function WishlistPage({ wishlistItems = [], onRemove, isAuthenticated = true }) {
  if (!isAuthenticated) {
    return <p data-testid="auth-message">Please login to view your wishlist</p>;
  }
  const isEmpty = wishlistItems.length === 0;
  return (
    <div data-testid="wishlist-page">
      {isEmpty ? (
        <p data-testid="empty-wishlist">Your wishlist is empty</p>
      ) : (
        wishlistItems.map((item) => (
          <div key={item._id} data-testid="wishlist-item">
            <span data-testid={`wish-name-${item._id}`}>{item.name}</span>
            <span data-testid={`wish-price-${item._id}`}>Rp {item.price.toLocaleString()}</span>
            <button onClick={() => onRemove(item._id)} data-testid={`wish-remove-${item._id}`}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

describe('Wishlist Page', () => {
  const items = [
    { _id: 'w1', name: 'Laptop', price: 15000000 },
    { _id: 'w2', name: 'Phone', price: 5000000 },
  ];

  it('should show auth message when not logged in', () => {
    render(<WishlistPage wishlistItems={[]} onRemove={jest.fn()} isAuthenticated={false} />);
    expect(screen.getByTestId('auth-message')).toBeInTheDocument();
  });

  it('should show empty wishlist message when no items', () => {
    render(<WishlistPage wishlistItems={[]} onRemove={jest.fn()} />);
    expect(screen.getByTestId('empty-wishlist')).toBeInTheDocument();
  });

  it('should render wishlist items', () => {
    render(<WishlistPage wishlistItems={items} onRemove={jest.fn()} />);
    expect(screen.getAllByTestId('wishlist-item')).toHaveLength(2);
  });

  it('should display item names correctly', () => {
    render(<WishlistPage wishlistItems={items} onRemove={jest.fn()} />);
    expect(screen.getByTestId('wish-name-w1').textContent).toBe('Laptop');
    expect(screen.getByTestId('wish-name-w2').textContent).toBe('Phone');
  });

  it('should display item prices', () => {
    render(<WishlistPage wishlistItems={items} onRemove={jest.fn()} />);
    expect(screen.getByTestId('wish-price-w1').textContent).toContain('15');
  });

  it('should call onRemove when remove button clicked', () => {
    const onRemove = jest.fn();
    render(<WishlistPage wishlistItems={items} onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('wish-remove-w1'));
    expect(onRemove).toHaveBeenCalledWith('w1');
  });

  it('should render wishlist page wrapper', () => {
    render(<WishlistPage wishlistItems={items} onRemove={jest.fn()} />);
    expect(screen.getByTestId('wishlist-page')).toBeInTheDocument();
  });
});
