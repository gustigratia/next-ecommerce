import dbConnect from '@/backend/config/dbConnect';
import { verifyIdToken } from '@/backend/config/firebaseAdmin';
import { Cart } from '@/backend/models/cart';

/**
 * @jest-environment node
 */

/**
 * Integration Tests — /api/cart
 *
 * Covers fetching, adding, updating, removing, and clearing cart items via API.
 * MongoDB and Firebase auth are mocked.
 */

if (typeof Response !== 'undefined' && typeof Response.json !== 'function') {
  Response.json = function json(data, init = {}) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init.headers || {}),
      },
    });
  };
}

jest.mock('@/backend/config/dbConnect', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/backend/config/firebaseAdmin', () => ({
  verifyIdToken: jest.fn(),
}));

jest.mock('@/backend/models/cart', () => ({
  Cart: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const mockCartItems = [
  {
    product: 'prod_1',
    name: 'Classic Sneakers',
    quantity: 2,
    price: 99.99,
    image: '/images/sneakers.jpg',
    stock: 20,
    seller: 'Nike',
  },
];

function createRequest(url, { method = 'GET', token = 'valid_token', body } = {}) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  return new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

function createMockCart(items = mockCartItems) {
  return {
    userId: 'user_abc',
    items: [...items],
    save: jest.fn().mockResolvedValue(true),
  };
}

describe('GET /api/cart', () => {
  let GET;

  beforeAll(async () => {
    const mod = await import('@/app/api/cart/route');
    GET = mod.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    dbConnect.mockResolvedValue(undefined);
    verifyIdToken.mockResolvedValue({
      uid: 'user_abc',
      email: 'test@test.com',
    });
  });

  it('returns the user cart when authenticated', async () => {
    Cart.findOne.mockResolvedValue(createMockCart());

    const req = createRequest('http://localhost:3000/api/cart');

    const res = await GET(req);
    const body = await res.json();

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(verifyIdToken).toHaveBeenCalledWith('valid_token');
    expect(Cart.findOne).toHaveBeenCalledWith({ userId: 'user_abc' });

    expect(res.status).toBe(200);
    expect(body.cart.cartItems).toHaveLength(1);
    expect(body.cart.cartItems[0].product).toBe('prod_1');
  });

  it('returns empty cart when user has no cart document', async () => {
    Cart.findOne.mockResolvedValue(null);

    const req = createRequest('http://localhost:3000/api/cart');

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.cart.cartItems).toEqual([]);
  });

  it('returns 401 when no auth token is provided', async () => {
    const req = createRequest('http://localhost:3000/api/cart', {
      token: null,
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
    expect(verifyIdToken).not.toHaveBeenCalled();
  });
});

describe('POST /api/cart', () => {
  let POST;

  beforeAll(async () => {
    const mod = await import('@/app/api/cart/route');
    POST = mod.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    dbConnect.mockResolvedValue(undefined);
    verifyIdToken.mockResolvedValue({
      uid: 'user_abc',
      email: 'test@test.com',
    });
  });

  it('adds an item to an existing cart', async () => {
    const existingCart = createMockCart();

    Cart.findOne.mockResolvedValue(existingCart);

    const newItem = {
      product: 'prod_2',
      name: 'Running Shoes',
      quantity: 1,
      price: 129.99,
      image: '/images/running.jpg',
      stock: 15,
      seller: 'Adidas',
    };

    const req = createRequest('http://localhost:3000/api/cart', {
      method: 'POST',
      body: newItem,
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(existingCart.items).toHaveLength(2);
    expect(existingCart.items[1]).toEqual(newItem);
    expect(existingCart.save).toHaveBeenCalledTimes(1);
    expect(body.cart.cartItems).toHaveLength(2);
  });

  it('updates an existing item in the cart', async () => {
    const existingCart = createMockCart();

    Cart.findOne.mockResolvedValue(existingCart);

    const updatedItem = {
      product: 'prod_1',
      name: 'Classic Sneakers',
      quantity: 5,
      price: 99.99,
      image: '/images/sneakers.jpg',
      stock: 20,
      seller: 'Nike',
    };

    const req = createRequest('http://localhost:3000/api/cart', {
      method: 'POST',
      body: updatedItem,
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(existingCart.items).toHaveLength(1);
    expect(existingCart.items[0].quantity).toBe(5);
    expect(existingCart.save).toHaveBeenCalledTimes(1);
    expect(body.cart.cartItems[0].quantity).toBe(5);
  });

  it('creates a new cart if none exists', async () => {
    const newItem = {
      product: 'prod_1',
      name: 'Classic Sneakers',
      quantity: 1,
      price: 99.99,
      image: '/images/sneakers.jpg',
      stock: 20,
      seller: 'Nike',
    };

    Cart.findOne.mockResolvedValue(null);
    Cart.create.mockResolvedValue({
      userId: 'user_abc',
      items: [newItem],
    });

    const req = createRequest('http://localhost:3000/api/cart', {
      method: 'POST',
      body: newItem,
    });

    const res = await POST(req);
    const body = await res.json();

    expect(Cart.create).toHaveBeenCalledWith({
      userId: 'user_abc',
      items: [newItem],
    });

    expect(res.status).toBe(201);
    expect(body.cart.cartItems).toHaveLength(1);
    expect(body.cart.cartItems[0].product).toBe('prod_1');
  });
});

describe('DELETE /api/cart', () => {
  let DELETE;

  beforeAll(async () => {
    const mod = await import('@/app/api/cart/route');
    DELETE = mod.DELETE;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    dbConnect.mockResolvedValue(undefined);
    verifyIdToken.mockResolvedValue({
      uid: 'user_abc',
      email: 'test@test.com',
    });
  });

  it('removes one item from the cart when product query is provided', async () => {
    const existingCart = createMockCart([
      ...mockCartItems,
      {
        product: 'prod_2',
        name: 'Running Shoes',
        quantity: 1,
        price: 129.99,
        image: '/images/running.jpg',
        stock: 15,
        seller: 'Adidas',
      },
    ]);

    Cart.findOne.mockResolvedValue(existingCart);

    const req = createRequest('http://localhost:3000/api/cart?product=prod_1', {
      method: 'DELETE',
    });

    const res = await DELETE(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(existingCart.items).toHaveLength(1);
    expect(existingCart.items[0].product).toBe('prod_2');
    expect(existingCart.save).toHaveBeenCalledTimes(1);
    expect(body.cart.cartItems).toHaveLength(1);
  });

  it('clears the cart when no product query is provided', async () => {
    const existingCart = createMockCart();

    Cart.findOne.mockResolvedValue(existingCart);

    const req = createRequest('http://localhost:3000/api/cart', {
      method: 'DELETE',
    });

    const res = await DELETE(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(existingCart.items).toEqual([]);
    expect(existingCart.save).toHaveBeenCalledTimes(1);
    expect(body.cart.cartItems).toEqual([]);
  });

  it('returns empty cart when deleting but cart does not exist', async () => {
    Cart.findOne.mockResolvedValue(null);

    const req = createRequest('http://localhost:3000/api/cart?product=prod_1', {
      method: 'DELETE',
    });

    const res = await DELETE(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.cart.cartItems).toEqual([]);
  });
});
