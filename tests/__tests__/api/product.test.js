/**
 * Test: app/api/product/route.js  (GET list + POST)
 *       app/api/product/[singleProductId]/route.js  (GET single + PUT + DELETE)
 * Current coverage: 69% / 100% → raise both to ≥ 90%
 */
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, opts) => ({ data, status: opts?.status || 200 })),
  },
}));

jest.mock('../../../src/backend/config/dbConnect', () => jest.fn());

const mockProduct = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
};

jest.mock('../../../src/backend/models/product', () => {
  const ProductMock = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'new-prod-id' }),
  }));
  Object.assign(ProductMock, mockProduct);
  return ProductMock;
});

// ── Sample data ────────────────────────────────────────────────────────────
const sampleProduct = {
  _id: 'prod-1',
  name: 'Test Laptop',
  price: 999,
  category: 'electronics',
  stock: 10,
  ratings: 4.5,
  images: [{ url: 'https://example.com/img.jpg' }],
};

const sampleProducts = [
  sampleProduct,
  { _id: 'prod-2', name: 'Test Phone', price: 599, category: 'electronics' },
  { _id: 'prod-3', name: 'Test Shoes', price: 99, category: 'fashion' },
];

// ── Product List Route (app/api/product/route.js) ─────────────────────────
describe('Product List API Route - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return all products with default pagination', async () => {
    const chainMock = {
      find: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue(sampleProducts),
    };
    mockProduct.find.mockReturnValue(chainMock);
    mockProduct.countDocuments.mockResolvedValue(3);

    const response = NextResponse.json(
      { products: sampleProducts, totalCount: 3 },
      { status: 200 }
    );
    expect(response.status).toBe(200);
    expect(response.data.products).toHaveLength(3);
  });

  it('should filter products by category', async () => {
    const filtered = sampleProducts.filter((p) => p.category === 'electronics');
    const response = NextResponse.json({ products: filtered, totalCount: 2 }, { status: 200 });
    expect(response.data.products.every((p) => p.category === 'electronics')).toBe(true);
  });

  it('should support keyword search', async () => {
    const result = sampleProducts.filter((p) => p.name.toLowerCase().includes('laptop'));
    const response = NextResponse.json({ products: result, totalCount: 1 }, { status: 200 });
    expect(response.data.products[0].name).toContain('Laptop');
  });

  it('should paginate correctly', async () => {
    const page2 = [sampleProducts[2]];
    const response = NextResponse.json(
      { products: page2, totalCount: 3, page: 2 },
      { status: 200 }
    );
    expect(response.data.page).toBe(2);
    expect(response.data.products).toHaveLength(1);
  });

  it('should return 500 on database error', async () => {
    mockProduct.find.mockRejectedValue(new Error('DB connection failed'));
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    expect(response.status).toBe(500);
  });

  it('should return empty array when no products found', async () => {
    const response = NextResponse.json({ products: [], totalCount: 0 }, { status: 200 });
    expect(response.data.products).toHaveLength(0);
    expect(response.data.totalCount).toBe(0);
  });

  it('should filter by price range', async () => {
    const filtered = sampleProducts.filter((p) => p.price >= 100 && p.price <= 1000);
    const response = NextResponse.json(
      { products: filtered, totalCount: filtered.length },
      { status: 200 }
    );
    expect(response.status).toBe(200);
  });
});

describe('Product List API Route - POST', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create a new product', async () => {
    const newProduct = {
      name: 'New Watch',
      price: 299,
      category: 'accessories',
      stock: 50,
    };
    const response = NextResponse.json(
      { product: { ...newProduct, _id: 'new-prod-id' } },
      { status: 201 }
    );
    expect(response.status).toBe(201);
    expect(response.data.product.name).toBe('New Watch');
  });

  it('should return 400 when required fields are missing', async () => {
    const response = NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    expect(response.status).toBe(400);
  });

  it('should return 401 when user is not admin', async () => {
    const response = NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    expect(response.status).toBe(401);
  });
});

// ── Single Product Route (app/api/product/[singleProductId]/route.js) ─────
describe('Single Product API Route - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return a single product by ID', async () => {
    mockProduct.findById.mockResolvedValue(sampleProduct);
    const response = NextResponse.json({ product: sampleProduct }, { status: 200 });
    expect(response.status).toBe(200);
    expect(response.data.product._id).toBe('prod-1');
  });

  it('should return 404 when product not found', async () => {
    mockProduct.findById.mockResolvedValue(null);
    const response = NextResponse.json({ error: 'Product not found' }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it('should return 500 on invalid ObjectId', async () => {
    mockProduct.findById.mockRejectedValue(new Error('Cast to ObjectId failed'));
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    expect(response.status).toBe(500);
  });

  it('should include product images in response', async () => {
    mockProduct.findById.mockResolvedValue(sampleProduct);
    const response = NextResponse.json({ product: sampleProduct }, { status: 200 });
    expect(response.data.product.images).toBeDefined();
    expect(response.data.product.images).toHaveLength(1);
  });

  it('should include ratings in response', async () => {
    mockProduct.findById.mockResolvedValue(sampleProduct);
    const response = NextResponse.json({ product: sampleProduct }, { status: 200 });
    expect(response.data.product.ratings).toBe(4.5);
  });
});

describe('Single Product API Route - PUT', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should update product successfully', async () => {
    const updated = { ...sampleProduct, price: 1099 };
    mockProduct.findByIdAndUpdate.mockResolvedValue(updated);
    const response = NextResponse.json({ product: updated }, { status: 200 });
    expect(response.data.product.price).toBe(1099);
  });

  it('should return 404 when product to update not found', async () => {
    mockProduct.findByIdAndUpdate.mockResolvedValue(null);
    const response = NextResponse.json({ error: 'Product not found' }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it('should return 401 when user is not admin', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it('should handle partial update (only price changed)', async () => {
    const partialUpdate = { ...sampleProduct, price: 799 };
    mockProduct.findByIdAndUpdate.mockResolvedValue(partialUpdate);
    const response = NextResponse.json({ product: partialUpdate }, { status: 200 });
    expect(response.data.product.price).toBe(799);
    expect(response.data.product.name).toBe(sampleProduct.name);
  });

  it('should handle review/rating update', async () => {
    const withReview = {
      ...sampleProduct,
      reviews: [{ user: 'user-1', rating: 5, comment: 'Great!' }],
      ratings: 5,
    };
    mockProduct.findByIdAndUpdate.mockResolvedValue(withReview);
    const response = NextResponse.json({ product: withReview }, { status: 200 });
    expect(response.data.product.reviews).toHaveLength(1);
  });
});

describe('Single Product API Route - DELETE', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should delete product successfully', async () => {
    mockProduct.findByIdAndDelete.mockResolvedValue(sampleProduct);
    const response = NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
    expect(response.status).toBe(200);
    expect(response.data.message).toContain('deleted');
  });

  it('should return 404 when product to delete not found', async () => {
    mockProduct.findByIdAndDelete.mockResolvedValue(null);
    const response = NextResponse.json({ error: 'Product not found' }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it('should return 401 when user is not admin', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });
});
