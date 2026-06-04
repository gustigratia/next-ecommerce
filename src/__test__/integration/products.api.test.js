/**
 * @jest-environment node
 */
import dbConnect from '@/backend/config/dbConnect';
import { Product } from '@/backend/models/product';

/**
 * @jest-environment node
 */

/**
 * Integration Tests — /api/product
 *
 * These tests exercise the API route handler in-process with mocked
 * MongoDB model/query behavior, so no real database is needed in CI.
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

// Mock dbConnect default export
jest.mock('@/backend/config/dbConnect', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock named export Product
jest.mock('@/backend/models/product', () => ({
  Product: {
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

const mockProducts = [
  {
    _id: 'prod_1',
    name: 'Classic Sneakers',
    price: 99.99,
    category: 'Sports',
    images: [{ url: '/images/sneakers.jpg' }],
    ratings: 4.5,
    stock: 20,
    seller: 'Nike',
    description: 'Comfortable everyday sneakers.',
  },
  {
    _id: 'prod_2',
    name: 'Running Shoes',
    price: 129.99,
    category: 'Sports',
    images: [{ url: '/images/running.jpg' }],
    ratings: 4.2,
    stock: 15,
    seller: 'Adidas',
    description: 'Lightweight running shoes.',
  },
];

function createMockQuery(result) {
  const query = {
    find: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  };

  return query;
}

function createRequest(url) {
  return new Request(url, {
    method: 'GET',
  });
}

describe('GET /api/product', () => {
  let GET;

  beforeAll(async () => {
    const mod = await import('@/app/api/product/route');
    GET = mod.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    dbConnect.mockReturnValue(undefined);
  });

  it('returns a list of products with 200', async () => {
    const mockQuery = createMockQuery(mockProducts);
    Product.find.mockReturnValue(mockQuery);

    const req = createRequest('http://localhost:3000/api/product');
    const res = await GET(req);
    const body = await res.json();

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(Product.find).toHaveBeenCalledTimes(1);

    expect(mockQuery.limit).toHaveBeenCalledWith(4);
    expect(mockQuery.skip).toHaveBeenCalledWith(0);
    expect(mockQuery.exec).toHaveBeenCalledTimes(1);

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Products');
    expect(body.products).toHaveLength(2);
    expect(body.products[0].name).toBe('Classic Sneakers');
  });

  it('filters products by category', async () => {
    const mockQuery = createMockQuery([mockProducts[0]]);
    Product.find.mockReturnValue(mockQuery);

    const req = createRequest('http://localhost:3000/api/product?category=Sports');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockQuery.where).toHaveBeenCalledWith({ category: 'Sports' });
    expect(body.products).toHaveLength(1);
    expect(body.products[0].category).toBe('Sports');
  });

  it('supports keyword search', async () => {
    const mockQuery = createMockQuery([mockProducts[0]]);
    Product.find.mockReturnValue(mockQuery);

    const req = createRequest('http://localhost:3000/api/product?keyword=Sneakers');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockQuery.find).toHaveBeenCalledWith({
      name: {
        $regex: 'Sneakers',
        $options: 'i',
      },
    });
    expect(body.products[0].name).toBe('Classic Sneakers');
  });

  it('supports low-to-high price sorting', async () => {
    const mockQuery = createMockQuery(mockProducts);
    Product.find.mockReturnValue(mockQuery);

    const req = createRequest('http://localhost:3000/api/product?sort=lowToHigh');
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(mockQuery.sort).toHaveBeenCalledWith('price');
  });

  it('supports high-to-low price sorting', async () => {
    const mockQuery = createMockQuery(mockProducts);
    Product.find.mockReturnValue(mockQuery);

    const req = createRequest('http://localhost:3000/api/product?sort=highToLow');
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(mockQuery.sort).toHaveBeenCalledWith('-price');
  });

  it('supports rating filter', async () => {
    const mockQuery = createMockQuery([mockProducts[0]]);
    Product.find.mockReturnValue(mockQuery);

    const req = createRequest('http://localhost:3000/api/product?rating=4');
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(mockQuery.where).toHaveBeenCalledWith({
      ratings: {
        $gte: '4',
      },
    });
  });

  it('supports pagination via page param', async () => {
    const mockQuery = createMockQuery([mockProducts[1]]);
    Product.find.mockReturnValue(mockQuery);

    const req = createRequest('http://localhost:3000/api/product?page=2');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);

    // resPerPage in the actual route is fixed to 4
    expect(mockQuery.limit).toHaveBeenCalledWith(4);
    expect(mockQuery.skip).toHaveBeenCalledWith(4);

    expect(body.products).toHaveLength(1);
    expect(body.products[0].name).toBe('Running Shoes');
  });

  it('returns 500 when the database query throws', async () => {
    Product.find.mockImplementation(() => {
      throw new Error('DB connection failed');
    });

    const req = createRequest('http://localhost:3000/api/product');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Internal Server Error');
  });
});

describe('GET /api/product/[singleProductId]', () => {
  let GET;

  beforeAll(async () => {
    const mod = await import('@/app/api/product/[singleProductId]/route');
    GET = mod.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    dbConnect.mockReturnValue(undefined);
  });

  it('returns a single product by id', async () => {
    Product.findById.mockResolvedValue(mockProducts[0]);

    const req = createRequest('http://localhost:3000/api/product/prod_1');

    const res = await GET(req, {
      params: {
        singleProductId: 'prod_1',
      },
    });

    const body = await res.json();

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(Product.findById).toHaveBeenCalledWith('prod_1');

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.singleProductDetail.name).toBe('Classic Sneakers');
  });

  it('returns 200 with null singleProductDetail when product is not found', async () => {
    Product.findById.mockResolvedValue(null);

    const req = createRequest('http://localhost:3000/api/product/nonexistent');

    const res = await GET(req, {
      params: {
        singleProductId: 'nonexistent',
      },
    });

    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.singleProductDetail).toBeNull();
  });

  it('returns 502 when findById throws an error', async () => {
    Product.findById.mockRejectedValue(new Error('Product lookup failed'));

    const req = createRequest('http://localhost:3000/api/product/prod_1');

    const res = await GET(req, {
      params: {
        singleProductId: 'prod_1',
      },
    });

    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBe('Product lookup failed');
  });
});
