/** Coverage for src/backend/config/dbConnect.js, firebaseAdmin.js, and src/app/context/firebaseConfig.js */

describe('dbConnect', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('does nothing when mongoose is already connected', async () => {
    const connect = jest.fn();
    const set = jest.fn();
    jest.doMock('mongoose', () => ({
      __esModule: true,
      default: { connection: { readyState: 1 }, connect, set },
      connection: { readyState: 1 },
      connect,
      set,
    }));

    const dbConnect = require('@/backend/config/dbConnect').default;
    await dbConnect();

    expect(connect).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });

  it('throws when DB_URI is missing', async () => {
    delete process.env.DB_URI;
    jest.doMock('mongoose', () => ({
      __esModule: true,
      default: { connection: { readyState: 0 }, connect: jest.fn(), set: jest.fn() },
    }));

    const dbConnect = require('@/backend/config/dbConnect').default;
    await expect(dbConnect()).rejects.toThrow('DB_URI is not defined');
  });

  it('sets strictQuery and connects to DB_URI', async () => {
    process.env.DB_URI = 'mongodb://localhost:27017/test';
    const connect = jest.fn().mockResolvedValue(undefined);
    const set = jest.fn();
    jest.doMock('mongoose', () => ({
      __esModule: true,
      default: { connection: { readyState: 0 }, connect, set },
    }));

    const dbConnect = require('@/backend/config/dbConnect').default;
    await dbConnect();

    expect(set).toHaveBeenCalledWith('strictQuery', false);
    expect(connect).toHaveBeenCalledWith('mongodb://localhost:27017/test');
  });
});

describe('firebaseAdmin verifyIdToken', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throws when Firebase Admin env variables are missing', async () => {
    delete process.env.FIREBASE_ADMIN_PROJECT_ID;
    delete process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    delete process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    delete process.env.FIREBASE_ADMIN_PRIVATE_KEY_B64;

    jest.doMock('firebase-admin/app', () => ({
      cert: jest.fn(),
      getApps: jest.fn(() => []),
      initializeApp: jest.fn(),
    }));
    jest.doMock('firebase-admin/auth', () => ({ getAuth: jest.fn() }));

    const { verifyIdToken } = require('@/backend/config/firebaseAdmin');
    await expect(verifyIdToken('token')).rejects.toThrow(
      'Firebase Admin environment variables are missing'
    );
  });

  it('initializes app and verifies id token', async () => {
    process.env.FIREBASE_ADMIN_PROJECT_ID = 'project-id';
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL = 'client@example.com';
    process.env.FIREBASE_ADMIN_PRIVATE_KEY = 'line1\\nline2';

    const app = { name: 'admin-app' };
    const decoded = { uid: 'user-1' };
    const verifyIdTokenMock = jest.fn().mockResolvedValue(decoded);
    const cert = jest.fn((value) => ({ credential: value }));
    const initializeApp = jest.fn(() => app);

    jest.doMock('firebase-admin/app', () => ({
      cert,
      getApps: jest.fn(() => []),
      initializeApp,
    }));
    jest.doMock('firebase-admin/auth', () => ({
      getAuth: jest.fn(() => ({ verifyIdToken: verifyIdTokenMock })),
    }));

    const { verifyIdToken } = require('@/backend/config/firebaseAdmin');
    await expect(verifyIdToken('token')).resolves.toEqual(decoded);

    expect(cert).toHaveBeenCalledWith({
      projectId: 'project-id',
      clientEmail: 'client@example.com',
      privateKey: 'line1\nline2',
    });
    expect(initializeApp).toHaveBeenCalled();
    expect(verifyIdTokenMock).toHaveBeenCalledWith('token');
  });

  it('reuses existing Firebase Admin app', async () => {
    const app = { name: 'existing-app' };
    const verifyIdTokenMock = jest.fn().mockResolvedValue({ uid: 'existing-user' });
    jest.doMock('firebase-admin/app', () => ({
      cert: jest.fn(),
      getApps: jest.fn(() => [app]),
      initializeApp: jest.fn(),
    }));
    jest.doMock('firebase-admin/auth', () => ({
      getAuth: jest.fn(() => ({ verifyIdToken: verifyIdTokenMock })),
    }));

    const { verifyIdToken } = require('@/backend/config/firebaseAdmin');
    await expect(verifyIdToken('token')).resolves.toEqual({ uid: 'existing-user' });
  });
});

describe('firebaseConfig', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('initializes Firebase app when no app exists', () => {
    const app = { name: 'new-firebase-app' };
    const initializeApp = jest.fn(() => app);
    jest.doMock('firebase/app', () => ({
      getApps: jest.fn(() => []),
      getApp: jest.fn(),
      initializeApp,
    }));

    const { firebaseApp } = require('@/app/context/firebaseConfig');

    expect(firebaseApp).toEqual(app);
    expect(initializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      })
    );
  });

  it('uses existing Firebase app when already initialized', () => {
    const app = { name: 'existing-firebase-app' };
    const getApp = jest.fn(() => app);
    const initializeApp = jest.fn();
    jest.doMock('firebase/app', () => ({
      getApps: jest.fn(() => [app]),
      getApp,
      initializeApp,
    }));

    const { firebaseApp } = require('@/app/context/firebaseConfig');

    expect(firebaseApp).toEqual(app);
    expect(getApp).toHaveBeenCalled();
    expect(initializeApp).not.toHaveBeenCalled();
  });
});
