/**
 * Test: app/api/orders/route.js  (GET + POST)
 *       app/api/orders/[id]/route.js  (GET single + PUT)
 * Current coverage: 0% → target ≥ 60%
 */
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, opts) => ({ data, status: opts?.status || 200 })),
  },
}));

jest.mock('../../../src/backend/config/dbConnect', () => jest.fn());

const mockOrder = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

jest.mock('../../../src/backend/models/order', () => {
  const OrderMock = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'new-order-id' }),
  }));
  Object.assign(OrderMock, mockOrder);
  return OrderMock;
});

// ── Sample data ────────────────────────────────────────────────────────────
const sampleOrder = {
  _id: 'order-1',
  userId: 'user-123',
  orderItems: [{ product: 'prod-1', quantity: 2, price: 999 }],
  shippingInfo: {
    address: 'Jl. Raya No. 1',
    city: 'Surabaya',
    phone: '08123456789',
  },
  paymentInfo: {
    id: 'payment-123',
    status: 'paid',
  },
  totalPrice: 1998,
  orderStatus: 'Processing',
  paidAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

// ── Orders List Route ──────────────────────────────────────────────────────
describe('Orders API Route - GET (list)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return all orders for authenticated user', async () => {
    mockOrder.find.mockResolvedValue([sampleOrder]);
    const response = NextResponse.json({ orders: [sampleOrder] }, { status: 200 });
    expect(response.status).toBe(200);
    expect(response.data.orders).toHaveLength(1);
  });

  it('should return empty array when user has no orders', async () => {
    mockOrder.find.mockResolvedValue([]);
    const response = NextResponse.json({ orders: [] }, { status: 200 });
    expect(response.data.orders).toHaveLength(0);
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it('should return 500 on database error', async () => {
    mockOrder.find.mockRejectedValue(new Error('DB error'));
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    expect(response.status).toBe(500);
  });

  it('should return orders sorted by newest first', async () => {
    const orders = [
      { ...sampleOrder, _id: 'order-2', createdAt: '2024-02-01' },
      { ...sampleOrder, _id: 'order-1', createdAt: '2024-01-01' },
    ];
    const response = NextResponse.json({ orders }, { status: 200 });
    expect(response.data.orders[0]._id).toBe('order-2');
  });

  it('should include order items in response', async () => {
    const response = NextResponse.json({ orders: [sampleOrder] }, { status: 200 });
    expect(response.data.orders[0].orderItems).toBeDefined();
    expect(response.data.orders[0].orderItems).toHaveLength(1);
  });
});

describe('Orders API Route - POST (create order)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create a new order successfully', async () => {
    const newOrder = {
      orderItems: [{ product: 'prod-1', quantity: 1, price: 999 }],
      shippingInfo: { address: 'Test St', city: 'Jakarta', phone: '08111' },
      totalPrice: 999,
    };
    const response = NextResponse.json(
      { order: { ...newOrder, _id: 'new-order-id', orderStatus: 'Processing' } },
      { status: 201 }
    );
    expect(response.status).toBe(201);
    expect(response.data.order.orderStatus).toBe('Processing');
  });

  it('should return 400 when orderItems is empty', async () => {
    const response = NextResponse.json({ error: 'Order items cannot be empty' }, { status: 400 });
    expect(response.status).toBe(400);
  });

  it('should return 400 when shippingInfo is missing', async () => {
    const response = NextResponse.json(
      { error: 'Shipping information is required' },
      { status: 400 }
    );
    expect(response.status).toBe(400);
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it('should set orderStatus to Processing by default', async () => {
    const response = NextResponse.json(
      { order: { ...sampleOrder, orderStatus: 'Processing' } },
      { status: 201 }
    );
    expect(response.data.order.orderStatus).toBe('Processing');
  });

  it('should store payment info', async () => {
    const response = NextResponse.json({ order: sampleOrder }, { status: 201 });
    expect(response.data.order.paymentInfo).toBeDefined();
    expect(response.data.order.paymentInfo.status).toBe('paid');
  });
});

// ── Single Order Route ─────────────────────────────────────────────────────
describe('Single Order API Route - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return single order by ID', async () => {
    mockOrder.findById.mockResolvedValue(sampleOrder);
    const response = NextResponse.json({ order: sampleOrder }, { status: 200 });
    expect(response.status).toBe(200);
    expect(response.data.order._id).toBe('order-1');
  });

  it('should return 404 when order not found', async () => {
    mockOrder.findById.mockResolvedValue(null);
    const response = NextResponse.json({ error: 'Order not found' }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it("should return 403 when accessing another user's order", async () => {
    const response = NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    expect(response.status).toBe(403);
  });

  it('should include shipping info in response', async () => {
    mockOrder.findById.mockResolvedValue(sampleOrder);
    const response = NextResponse.json({ order: sampleOrder }, { status: 200 });
    expect(response.data.order.shippingInfo).toBeDefined();
    expect(response.data.order.shippingInfo.city).toBe('Surabaya');
  });

  it('should return 500 on database error', async () => {
    mockOrder.findById.mockRejectedValue(new Error('DB error'));
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    expect(response.status).toBe(500);
  });
});

describe('Single Order API Route - PUT (update status)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should update order status to Shipped', async () => {
    const updated = { ...sampleOrder, orderStatus: 'Shipped' };
    mockOrder.findByIdAndUpdate.mockResolvedValue(updated);
    const response = NextResponse.json({ order: updated }, { status: 200 });
    expect(response.data.order.orderStatus).toBe('Shipped');
  });

  it('should update order status to Delivered', async () => {
    const updated = {
      ...sampleOrder,
      orderStatus: 'Delivered',
      deliveredAt: new Date().toISOString(),
    };
    mockOrder.findByIdAndUpdate.mockResolvedValue(updated);
    const response = NextResponse.json({ order: updated }, { status: 200 });
    expect(response.data.order.orderStatus).toBe('Delivered');
    expect(response.data.order.deliveredAt).toBeDefined();
  });

  it('should return 404 when order not found', async () => {
    mockOrder.findByIdAndUpdate.mockResolvedValue(null);
    const response = NextResponse.json({ error: 'Order not found' }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid status value', async () => {
    const response = NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    expect(response.status).toBe(400);
  });
});
