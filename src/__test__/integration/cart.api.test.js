/**
 * Integration Tests — /api/cart
 *
 * Covers adding, updating, and clearing cart items via the API.
 * MongoDB and Firebase auth are both mocked.
 */
import { createMocks } from 'node-mocks-http';

import Cart from '@/models/Cart';

jest.mock(
  '@/lib/mongodb',
  () => ({
    connectDB: jest.fn(),
  }),
  { virtual: true }
);

jest.mock(
  '@/lib/firebaseAdmin',
  () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: 'user_abc',
      email: 'test@test.com',
    }),
  }),
  { virtual: true }
);

jest.mock(
  '@/models/Cart',
  () => ({
    findOne: jest.fn(),
    create: jest.fn(),
  }),
  { virtual: true }
);

const mockCart = {
  userId: 'user_abc',
  items: [
    {
      productId: 'prod_1',
      quantity: 2,
      price: 99.99,
      title: 'Classic Sneakers',
    },
  ],
  save: jest.fn().mockResolvedValue(true),
};

describe('GET /api/cart', () => {
  let handler;

  beforeAll(async () => {
    const mod = await import('@/app/api/cart/route');
    handler = mod.GET;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns the user cart when authenticated', async () => {
    Cart.findOne.mockResolvedValue(mockCart);

    const { req } = createMocks({
      method: 'GET',
      headers: { authorization: 'Bearer valid_token' },
    });

    const res = await handler(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items).toHaveLength(1);
  });

  it('returns 401 when no auth token is provided', async () => {
    const { req } = createMocks({
      method: 'GET',
      headers: {},
    });

    const { verifyIdToken } = await import('@/lib/firebaseAdmin');
    verifyIdToken.mockRejectedValueOnce(new Error('No token'));

    const res = await handler(req);

    expect(res.status).toBe(401);
  });
});

describe('POST /api/cart', () => {
  let handler;

  beforeAll(async () => {
    const mod = await import('@/app/api/cart/route');
    handler = mod.POST;
  });

  beforeEach(() => jest.clearAllMocks());

  it('adds an item to an existing cart', async () => {
    const updatedCart = {
      ...mockCart,
      items: [...mockCart.items, { productId: 'prod_2', quantity: 1 }],
    };

    Cart.findOne.mockResolvedValue({
      ...mockCart,
      save: jest.fn().mockResolvedValue(updatedCart),
    });

    const { req } = createMocks({
      method: 'POST',
      headers: { authorization: 'Bearer valid_token' },
      body: {
        productId: 'prod_2',
        quantity: 1,
        price: 129.99,
        title: 'Running Shoes',
      },
    });

    const res = await handler(req);

    expect(res.status).toBe(200);
  });

  it('creates a new cart if none exists', async () => {
    Cart.findOne.mockResolvedValue(null);
    Cart.create.mockResolvedValue({
      userId: 'user_abc',
      items: [{ productId: 'prod_1', quantity: 1 }],
    });

    const { req } = createMocks({
      method: 'POST',
      headers: { authorization: 'Bearer valid_token' },
      body: {
        productId: 'prod_1',
        quantity: 1,
        price: 99.99,
        title: 'Classic Sneakers',
      },
    });

    const res = await handler(req);

    expect(Cart.create).toHaveBeenCalled();
    expect(res.status).toBe(201);
  });
});
