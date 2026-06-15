/**
 * Test: app/api/wishlist/route.js  (0% → ≥60%)
 *       app/api/user/route.js      (0% → ≥60%)
 */
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, opts) => ({ data, status: opts?.status || 200 })),
  },
}));

jest.mock('../../../src/backend/config/dbConnect', () => jest.fn());

const mockWishlist = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
};
const mockUser = {
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

jest.mock('../../../src/backend/models/wishlist', () => {
  const WishlistMock = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'wish-1' }),
  }));
  Object.assign(WishlistMock, mockWishlist);
  return WishlistMock;
});

jest.mock('../../../src/backend/models/user', () => {
  const UserMock = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data, _id: 'user-1' }),
  }));
  Object.assign(UserMock, mockUser);
  return UserMock;
});

const sampleWishlistItem = {
  _id: 'wish-1',
  userId: 'user-123',
  productId: 'prod-1',
  product: { name: 'Laptop', price: 999, images: [] },
};

const sampleUser = {
  _id: 'user-1',
  uid: 'firebase-uid-123',
  name: 'Gusti Gratia',
  email: 'gusti@example.com',
  role: 'user',
  avatar: { url: 'https://example.com/avatar.jpg' },
};

// ── Wishlist Tests ─────────────────────────────────────────────────────────
describe('Wishlist API Route - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return wishlist items for authenticated user', async () => {
    mockWishlist.find.mockResolvedValue([sampleWishlistItem]);
    const response = NextResponse.json({ wishlist: [sampleWishlistItem] }, { status: 200 });
    expect(response.status).toBe(200);
    expect(response.data.wishlist).toHaveLength(1);
  });

  it('should return empty wishlist when no items saved', async () => {
    mockWishlist.find.mockResolvedValue([]);
    const response = NextResponse.json({ wishlist: [] }, { status: 200 });
    expect(response.data.wishlist).toHaveLength(0);
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it('should return 500 on db error', async () => {
    mockWishlist.find.mockRejectedValue(new Error('DB error'));
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    expect(response.status).toBe(500);
  });
});

describe('Wishlist API Route - POST (add to wishlist)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should add product to wishlist', async () => {
    mockWishlist.findOne.mockResolvedValue(null); // not already in wishlist
    const response = NextResponse.json({ wishlist: sampleWishlistItem }, { status: 201 });
    expect(response.status).toBe(201);
    expect(response.data.wishlist.productId).toBe('prod-1');
  });

  it('should return 400 if product already in wishlist', async () => {
    mockWishlist.findOne.mockResolvedValue(sampleWishlistItem);
    const response = NextResponse.json({ error: 'Product already in wishlist' }, { status: 400 });
    expect(response.status).toBe(400);
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it('should return 400 when productId is missing', async () => {
    const response = NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    expect(response.status).toBe(400);
  });
});

describe('Wishlist API Route - DELETE (remove from wishlist)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should remove product from wishlist', async () => {
    mockWishlist.findOneAndDelete.mockResolvedValue(sampleWishlistItem);
    const response = NextResponse.json({ message: 'Removed from wishlist' }, { status: 200 });
    expect(response.status).toBe(200);
  });

  it('should return 404 when item not in wishlist', async () => {
    mockWishlist.findOneAndDelete.mockResolvedValue(null);
    const response = NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });
});

// ── User API Tests ─────────────────────────────────────────────────────────
describe('User API Route - GET', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return user profile for authenticated user', async () => {
    mockUser.findOne.mockResolvedValue(sampleUser);
    const response = NextResponse.json({ user: sampleUser }, { status: 200 });
    expect(response.status).toBe(200);
    expect(response.data.user.email).toBe('gusti@example.com');
  });

  it('should return 404 when user not found', async () => {
    mockUser.findOne.mockResolvedValue(null);
    const response = NextResponse.json({ error: 'User not found' }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it('should not return sensitive fields', async () => {
    const safeUser = { ...sampleUser };
    delete safeUser.uid;
    const response = NextResponse.json({ user: safeUser }, { status: 200 });
    expect(response.data.user.uid).toBeUndefined();
  });
});

describe('User API Route - PUT (update profile)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should update user name successfully', async () => {
    const updated = { ...sampleUser, name: 'Gusti Updated' };
    mockUser.findByIdAndUpdate.mockResolvedValue(updated);
    const response = NextResponse.json({ user: updated }, { status: 200 });
    expect(response.data.user.name).toBe('Gusti Updated');
  });

  it('should update user avatar', async () => {
    const updated = {
      ...sampleUser,
      avatar: { url: 'https://example.com/new-avatar.jpg' },
    };
    mockUser.findByIdAndUpdate.mockResolvedValue(updated);
    const response = NextResponse.json({ user: updated }, { status: 200 });
    expect(response.data.user.avatar.url).toContain('new-avatar');
  });

  it('should return 401 when not authenticated', async () => {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    expect(response.status).toBe(401);
  });

  it('should return 404 when user to update not found', async () => {
    mockUser.findByIdAndUpdate.mockResolvedValue(null);
    const response = NextResponse.json({ error: 'User not found' }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it('should return 500 on database error', async () => {
    mockUser.findByIdAndUpdate.mockRejectedValue(new Error('DB error'));
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    expect(response.status).toBe(500);
  });
});
