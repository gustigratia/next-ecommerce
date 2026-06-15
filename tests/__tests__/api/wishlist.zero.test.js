import { DELETE, GET, POST } from '@/app/api/wishlist/route';
import dbConnect from '@/backend/config/dbConnect';
import { verifyIdToken } from '@/backend/config/firebaseAdmin';
import { Wishlist } from '@/backend/models/wishlist';

/** Coverage for src/app/api/wishlist/route.js */
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
jest.mock('@/backend/models/wishlist', () => ({
  Wishlist: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const authHeaders = { authorization: 'Bearer valid-token', 'content-type': 'application/json' };
const wishlistItem = {
  product: 'p1',
  name: 'Laptop',
  price: 1000,
  imageUrl: '/laptop.png',
  ratings: 4.5,
  seller: 'Dell',
  stock: 5,
};

const makeReq = ({
  method = 'GET',
  body,
  url = 'http://localhost/api/wishlist',
  auth = true,
} = {}) =>
  new Request(url, {
    method,
    headers: auth ? authHeaders : { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

describe('/api/wishlist route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dbConnect.mockResolvedValue(undefined);
    verifyIdToken.mockResolvedValue({ uid: 'user-1', email: 'gusti@example.com' });
  });

  it('GET returns 401 when unauthenticated', async () => {
    const res = await GET(makeReq({ auth: false }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('GET returns empty wishlist when no document exists', async () => {
    Wishlist.findOne.mockResolvedValue(null);

    const res = await GET(makeReq());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Wishlist.findOne).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(data.wishlist.wishlistItems).toEqual([]);
  });

  it('GET returns wishlist items', async () => {
    Wishlist.findOne.mockResolvedValue({ items: [wishlistItem] });

    const res = await GET(makeReq());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.wishlist.wishlistItems).toEqual([wishlistItem]);
  });

  it('POST validates missing product field', async () => {
    const res = await POST(makeReq({ method: 'POST', body: { name: 'No id' } }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Product information is required');
  });

  it('POST creates a new wishlist when user has none', async () => {
    Wishlist.findOne.mockResolvedValue(null);
    Wishlist.create.mockResolvedValue({ items: [wishlistItem] });

    const res = await POST(makeReq({ method: 'POST', body: wishlistItem }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(Wishlist.create).toHaveBeenCalledWith({
      userId: 'user-1',
      items: [expect.objectContaining({ product: 'p1', name: 'Laptop' })],
    });
    expect(data.wishlist.wishlistItems).toEqual([wishlistItem]);
  });

  it('POST keeps wishlist unchanged when product already exists', async () => {
    const existingWishlist = { items: [wishlistItem], save: jest.fn() };
    Wishlist.findOne.mockResolvedValue(existingWishlist);

    const res = await POST(makeReq({ method: 'POST', body: wishlistItem }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(existingWishlist.save).not.toHaveBeenCalled();
    expect(data.wishlist.wishlistItems).toEqual([wishlistItem]);
  });

  it('POST pushes a new item into existing wishlist', async () => {
    const existingWishlist = { items: [], save: jest.fn().mockResolvedValue(undefined) };
    Wishlist.findOne.mockResolvedValue(existingWishlist);

    const res = await POST(makeReq({ method: 'POST', body: wishlistItem }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(existingWishlist.items).toHaveLength(1);
    expect(existingWishlist.save).toHaveBeenCalled();
    expect(data.wishlist.wishlistItems[0]).toEqual(expect.objectContaining({ product: 'p1' }));
  });

  it('DELETE returns empty wishlist when no wishlist exists', async () => {
    Wishlist.findOne.mockResolvedValue(null);

    const res = await DELETE(makeReq({ method: 'DELETE' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.wishlist.wishlistItems).toEqual([]);
  });

  it('DELETE removes a single product when product query exists', async () => {
    const existingWishlist = {
      items: [wishlistItem, { ...wishlistItem, product: 'p2', name: 'Mouse' }],
      save: jest.fn().mockResolvedValue(undefined),
    };
    Wishlist.findOne.mockResolvedValue(existingWishlist);

    const res = await DELETE(
      makeReq({ method: 'DELETE', url: 'http://localhost/api/wishlist?product=p1' })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(existingWishlist.items).toEqual([expect.objectContaining({ product: 'p2' })]);
    expect(existingWishlist.save).toHaveBeenCalled();
    expect(data.wishlist.wishlistItems).toEqual([expect.objectContaining({ product: 'p2' })]);
  });

  it('DELETE clears all wishlist items when product query is absent', async () => {
    const existingWishlist = {
      items: [wishlistItem],
      save: jest.fn().mockResolvedValue(undefined),
    };
    Wishlist.findOne.mockResolvedValue(existingWishlist);

    const res = await DELETE(makeReq({ method: 'DELETE' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(existingWishlist.items).toEqual([]);
    expect(data.wishlist.wishlistItems).toEqual([]);
  });

  it('returns 500 when unexpected error occurs', async () => {
    Wishlist.findOne.mockRejectedValue(new Error('db error'));

    const res = await GET(makeReq());
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('db error');
  });
});
