import { Request } from 'undici';

import { GET } from '@/app/api/orders/[id]/route';
import { POST } from '@/app/api/orders/route';
import dbConnect from '@/backend/config/dbConnect';
import { verifyIdToken } from '@/backend/config/firebaseAdmin';
import Order from '@/backend/models/order';

/**
 * Coverage for src/app/api/orders/route.js and src/app/api/orders/[id]/route.js
 */
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, init = {}) =>
      new Response(JSON.stringify(data), {
        status: init.status || 200,
        headers: { 'content-type': 'application/json', ...(init.headers || {}) },
      }),
  },
}));

jest.mock('@/backend/config/dbConnect', () => jest.fn());
jest.mock('@/backend/config/firebaseAdmin', () => ({ verifyIdToken: jest.fn() }));
jest.mock('@/backend/models/order', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

const jsonRequest = (body = {}, token = 'valid-token', url = 'http://localhost/api/orders') =>
  new Request(url, {
    method: 'POST',
    headers: token
      ? { authorization: `Bearer ${token}`, 'content-type': 'application/json' }
      : { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

const authGetRequest = (token = 'valid-token') =>
  new Request('http://localhost/api/orders/order-1', {
    method: 'GET',
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });

const validOrderBody = {
  shippingInfo: {
    fullName: 'Gusti Gratia',
    phone: '081234567890',
    address: 'Jl. Testing No. 1',
    city: 'Surabaya',
    postalCode: '60111',
    country: 'Indonesia',
  },
  paymentInfo: { method: 'COD' },
  orderItems: [{ product: 'p1', name: 'Laptop', quantity: 1, price: 1000 }],
  amountWithoutTax: 1000,
  taxAmount: 150,
  totalAmount: 1150,
};

describe('POST /api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dbConnect.mockResolvedValue(undefined);
    verifyIdToken.mockResolvedValue({ uid: 'user-1', email: 'gusti@example.com' });
  });

  it('returns 401 when authorization header is missing', async () => {
    const res = await POST(jsonRequest(validOrderBody, null));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toMatch(/Unauthorized/i);
    expect(Order.create).not.toHaveBeenCalled();
  });

  it('validates missing shipping information', async () => {
    const res = await POST(jsonRequest({ ...validOrderBody, shippingInfo: undefined }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe('Shipping information is required');
  });

  it('validates empty order items', async () => {
    const res = await POST(jsonRequest({ ...validOrderBody, orderItems: [] }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe('Order items are required');
  });

  it('validates missing payment method', async () => {
    const res = await POST(jsonRequest({ ...validOrderBody, paymentInfo: {} }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe('Payment method is required');
  });

  it('creates an order for an authenticated user', async () => {
    const createdOrder = { _id: 'order-1', user: 'user-1', ...validOrderBody };
    Order.create.mockResolvedValue(createdOrder);

    const res = await POST(jsonRequest(validOrderBody));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: 'user-1',
        userEmail: 'gusti@example.com',
        orderStatus: 'Processing',
      })
    );
    expect(data.message).toBe('Order created successfully');
    expect(data.order).toEqual(createdOrder);
  });

  it('returns 500 when creating order fails', async () => {
    Order.create.mockRejectedValue(new Error('database down'));

    const res = await POST(jsonRequest(validOrderBody));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe('Failed to create order');
  });
});

describe('GET /api/orders/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dbConnect.mockResolvedValue(undefined);
    verifyIdToken.mockResolvedValue({ uid: 'user-1', email: 'gusti@example.com' });
  });

  it('returns 401 when authorization header is missing', async () => {
    const res = await GET(authGetRequest(null), { params: { id: 'order-1' } });
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toMatch(/Unauthorized/i);
  });

  it('returns 404 when order is not found for user', async () => {
    Order.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const res = await GET(authGetRequest(), { params: { id: 'missing-order' } });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe('Order not found');
  });

  it('returns order detail for authenticated owner', async () => {
    const order = { _id: 'order-1', user: 'user-1', totalAmount: 1150 };
    Order.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(order) });

    const res = await GET(authGetRequest(), { params: { id: 'order-1' } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Order.findOne).toHaveBeenCalledWith({ _id: 'order-1', user: 'user-1' });
    expect(data.order).toEqual(order);
  });

  it('returns 500 on unexpected failure', async () => {
    dbConnect.mockRejectedValueOnce(new Error('db failed'));

    const res = await GET(authGetRequest(), { params: { id: 'order-1' } });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe('Failed to get order');
  });
});
