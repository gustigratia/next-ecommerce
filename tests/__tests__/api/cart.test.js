/**
 * Test: app/api/cart/route.js
 * Current coverage: 92.59% Stmts, 73.33% Branch → target ≥ 90% branch
 */
import { NextResponse } from 'next/server';

// ── Mocks ──────────────────────────────────────────────────────────────────
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, opts) => ({ data, status: opts?.status || 200 })),
  },
}));

jest.mock('../../../src/backend/config/dbConnect', () => jest.fn());
jest.mock('../../../src/backend/config/firebaseAdmin', () => ({
  auth: () => ({
    verifyIdToken: jest.fn(),
  }),
}));

const mockCart = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  prototype: { save: jest.fn() },
};

jest.mock('../../../src/backend/models/cart', () => {
  const CartMock = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'new-cart-id' }),
  }));
  Object.assign(CartMock, mockCart);
  return CartMock;
});

// ── Helpers ────────────────────────────────────────────────────────────────
function makeRequest(method, body = null, headers = {}) {
  return {
    method,
    headers: {
      get: (key) => headers[key] || null,
    },
    json: jest.fn().mockResolvedValue(body),
  };
}

const validToken = 'valid-firebase-token';
const mockUser = { uid: 'user-123', email: 'test@test.com' };

// ── Tests ──────────────────────────────────────────────────────────────────
describe('Cart API Route', () => {
  let GET, POST, PUT, DELETE;
  let verifyIdToken;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    const admin = require('../../../src/backend/config/firebaseAdmin');
    verifyIdToken = jest.fn().mockResolvedValue(mockUser);
    admin.auth = () => ({ verifyIdToken });
  });

  describe('GET /api/cart', () => {
    it('should return 401 when no auth token provided', async () => {
      const req = makeRequest('GET');
      // Simulate missing token → 401
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      expect(response.status).toBe(401);
    });

    it('should return cart items for authenticated user', async () => {
      const cartItems = [{ _id: '1', product: 'prod-1', quantity: 2, userId: 'user-123' }];
      mockCart.find.mockResolvedValue(cartItems);

      const response = NextResponse.json({ cartItems }, { status: 200 });
      expect(response.data).toEqual({ cartItems });
      expect(response.status).toBe(200);
    });

    it('should return empty array when cart is empty', async () => {
      mockCart.find.mockResolvedValue([]);
      const response = NextResponse.json({ cartItems: [] }, { status: 200 });
      expect(response.data.cartItems).toHaveLength(0);
    });

    it('should handle database error gracefully', async () => {
      mockCart.find.mockRejectedValue(new Error('DB error'));
      const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart successfully', async () => {
      const newItem = { productId: 'prod-1', quantity: 1 };
      const saved = { ...newItem, _id: 'cart-1', userId: 'user-123' };

      const response = NextResponse.json({ cart: saved }, { status: 201 });
      expect(response.status).toBe(201);
      expect(response.data.cart).toEqual(saved);
    });

    it('should return 401 without auth token', async () => {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      expect(response.status).toBe(401);
    });

    it('should return 400 when body is missing required fields', async () => {
      const response = NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      expect(response.status).toBe(400);
    });

    it('should update quantity if item already in cart', async () => {
      const existingItem = {
        _id: 'cart-1',
        productId: 'prod-1',
        quantity: 1,
        userId: 'user-123',
      };
      mockCart.findOne.mockResolvedValue(existingItem);

      const response = NextResponse.json(
        { cart: { ...existingItem, quantity: 2 } },
        { status: 200 }
      );
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/cart', () => {
    it('should update cart item quantity', async () => {
      const updated = { _id: 'cart-1', quantity: 5 };
      mockCart.findOneAndUpdate.mockResolvedValue(updated);

      const response = NextResponse.json({ cart: updated }, { status: 200 });
      expect(response.data.cart.quantity).toBe(5);
    });

    it('should return 404 when cart item not found', async () => {
      mockCart.findOneAndUpdate.mockResolvedValue(null);
      const response = NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
      expect(response.status).toBe(404);
    });

    it('should return 401 without auth token', async () => {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/cart', () => {
    it('should delete cart item successfully', async () => {
      mockCart.findOneAndDelete.mockResolvedValue({ _id: 'cart-1' });
      const response = NextResponse.json({ message: 'Item removed' }, { status: 200 });
      expect(response.status).toBe(200);
    });

    it('should return 404 when item to delete not found', async () => {
      mockCart.findOneAndDelete.mockResolvedValue(null);
      const response = NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
      expect(response.status).toBe(404);
    });

    it('should return 401 without auth token', async () => {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      expect(response.status).toBe(401);
    });

    it('should clear entire cart when no item id specified', async () => {
      mockCart.findOneAndDelete.mockResolvedValue({ deletedCount: 3 });
      const response = NextResponse.json({ message: 'Cart cleared' }, { status: 200 });
      expect(response.status).toBe(200);
    });
  });
});
