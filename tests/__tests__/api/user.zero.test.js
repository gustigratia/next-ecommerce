import { GET, PUT } from '@/app/api/user/route';
import dbConnect from '@/backend/config/dbConnect';
import User from '@/backend/models/user';

/** Coverage for src/app/api/user/route.js */
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
jest.mock('@/backend/models/user', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('/api/user route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dbConnect.mockResolvedValue(undefined);
  });

  it('GET returns 400 when email query is missing', async () => {
    const res = await GET(new Request('http://localhost/api/user'));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Email is required');
  });

  it('GET returns 404 when user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await GET(new Request('http://localhost/api/user?email=gusti@example.com'));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(User.findOne).toHaveBeenCalledWith({ email: 'gusti@example.com' });
    expect(data.message).toBe('User not found in db');
  });

  it('GET returns user when found', async () => {
    const user = { email: 'gusti@example.com', firstName: 'Gusti' };
    User.findOne.mockResolvedValue(user);

    const res = await GET(new Request('http://localhost/api/user?email=gusti@example.com'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(user);
  });

  it('GET returns 500 on database error', async () => {
    User.findOne.mockRejectedValue(new Error('find failed'));

    const res = await GET(new Request('http://localhost/api/user?email=gusti@example.com'));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('find failed');
  });

  it('PUT returns 400 when email is missing', async () => {
    const res = await PUT(
      new Request('http://localhost/api/user', {
        method: 'PUT',
        body: JSON.stringify({ firstName: 'Gusti' }),
      })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Email is required to update profile');
  });

  it('PUT upserts user profile', async () => {
    const updatedUser = {
      email: 'gusti@example.com',
      firstName: 'Gusti',
      lastName: 'Gratia',
      phoneNumber: '081234567890',
    };
    User.findOneAndUpdate.mockResolvedValue(updatedUser);

    const res = await PUT(
      new Request('http://localhost/api/user', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'gusti@example.com' },
      {
        firstName: 'Gusti',
        lastName: 'Gratia',
        phoneNumber: '081234567890',
      },
      { new: true, upsert: true }
    );
    expect(data).toEqual(updatedUser);
  });

  it('PUT returns 500 on update failure', async () => {
    User.findOneAndUpdate.mockRejectedValue(new Error('update failed'));

    const res = await PUT(
      new Request('http://localhost/api/user', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'gusti@example.com' }),
      })
    );
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('update failed');
  });
});
