/**
 * Integration Tests — /api/products
 *
 * These tests exercise the full API handler in-process, with a mocked
 * MongoDB connection so no real database is needed in CI.
 */
import { createMocks } from 'node-mocks-http';

import Product from '@/models/Product';

// ── Mock mongoose before importing the handler ──────────────────────────────
jest.mock('@/lib/mongodb', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

const mockProducts = [
  {
    _id: 'prod_1',
    title: 'Classic Sneakers',
    price: 99.99,
    category: 'footwear',
    image: '/images/sneakers.jpg',
    rating: 4.5,
    stock: 20,
  },
  {
    _id: 'prod_2',
    title: 'Running Shoes',
    price: 129.99,
    category: 'footwear',
    image: '/images/running.jpg',
    rating: 4.2,
    stock: 15,
  },
];

jest.mock('@/models/Product', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn(),
}));

// ── Helper ───────────────────────────────────────────────────────────────────
function makeQuery(params = {}) {
  return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
}

// ── Tests ────────────────────────────────────────────────────────────────────
describe('GET /api/products', () => {
  let handler;

  beforeAll(async () => {
    // Dynamic import so mocks are in place first
    const mod = await import('@/app/api/products/route');
    handler = mod.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a list of products with 200', async () => {
    Product.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockProducts),
    });
    Product.countDocuments.mockResolvedValue(2);

    const { req } = createMocks({ method: 'GET', query: {} });
    const res = await handler(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.products).toHaveLength(2);
    expect(body.products[0].title).toBe('Classic Sneakers');
  });

  it('filters products by category', async () => {
    Product.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockProducts[0]]),
    });
    Product.countDocuments.mockResolvedValue(1);

    const { req } = createMocks({
      method: 'GET',
      query: makeQuery({ category: 'footwear' }),
    });
    const res = await handler(req);
    const body = await res.json();

    expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({ category: 'footwear' }));
    expect(body.products).toHaveLength(1);
  });

  it('supports pagination via page & limit params', async () => {
    Product.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockProducts[1]]),
    });
    Product.countDocuments.mockResolvedValue(2);

    const { req } = createMocks({ method: 'GET', query: { page: '2', limit: '1' } });
    const res = await handler(req);
    const body = await res.json();

    expect(body.currentPage).toBe(2);
    expect(body.totalPages).toBe(2);
  });

  it('returns 500 when the database throws', async () => {
    Product.find.mockImplementation(() => {
      throw new Error('DB connection failed');
    });

    const { req } = createMocks({ method: 'GET', query: {} });
    const res = await handler(req);

    expect(res.status).toBe(500);
  });
});

describe('GET /api/products/[id]', () => {
  let handler;

  beforeAll(async () => {
    const mod = await import('@/app/api/products/[id]/route');
    handler = mod.GET;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns a single product by id', async () => {
    Product.findById.mockResolvedValue(mockProducts[0]);

    const { req } = createMocks({ method: 'GET' });
    const res = await handler(req, { params: { id: 'prod_1' } });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.product.title).toBe('Classic Sneakers');
  });

  it('returns 404 when product is not found', async () => {
    Product.findById.mockResolvedValue(null);

    const { req } = createMocks({ method: 'GET' });
    const res = await handler(req, { params: { id: 'nonexistent' } });

    expect(res.status).toBe(404);
  });
});
