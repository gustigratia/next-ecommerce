/** Coverage for src/app/context/FirebaseContext.js and src/app/context/WishlistContext.js */
import React from 'react';
import { toast } from 'react-toastify';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import FirebaseContextProvider, { useFirebaseAppContext } from '@/app/context/FirebaseContext';
import { WishlistProvider, useWishlist } from '@/app/context/WishlistContext';

const mockAuthUser = {
  uid: 'user-1',
  displayName: 'Gusti',
  getIdToken: jest.fn().mockResolvedValue('token'),
};
const mockUnsubscribe = jest.fn();

const mockCreateUser = jest.fn();
const mockSignInWithPopup = jest.fn();
const mockSignInWithEmail = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock('firebase/auth', () => ({
  FacebookAuthProvider: jest.fn(function FacebookAuthProvider() {}),
  GithubAuthProvider: jest.fn(function GithubAuthProvider() {}),
  GoogleAuthProvider: jest.fn(function GoogleAuthProvider() {}),
  TwitterAuthProvider: jest.fn(function TwitterAuthProvider() {}),
  createUserWithEmailAndPassword: (...args) => mockCreateUser(...args),
  getAuth: jest.fn(() => ({ name: 'firebase-auth' })),
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
  signInWithEmailAndPassword: (...args) => mockSignInWithEmail(...args),
  signInWithPopup: (...args) => mockSignInWithPopup(...args),
  signOut: (...args) => mockSignOut(...args),
}));

jest.mock('@/app/context/firebaseConfig', () => ({ firebaseApp: { name: 'firebase-app' } }));

jest.mock('react-toastify', () => ({
  toast: {
    warn: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

const mockJsonResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
  json: jest.fn().mockResolvedValue(data),
});

const product = {
  _id: 'p1',
  name: 'Gaming Laptop',
  price: 1000,
  ratings: 4,
  stock: 5,
  seller: 'Dell',
  images: [{ url: '/laptop.png' }],
};

function setAuthState(user) {
  mockOnAuthStateChanged.mockImplementation((auth, callback) => {
    callback(user);
    return mockUnsubscribe;
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  global.fetch = jest.fn();
  setAuthState(null);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('FirebaseContextProvider', () => {
  function FirebaseProbe({ onReady }) {
    const context = useFirebaseAppContext();
    onReady(context);
    return <div>{context.loading ? 'loading' : context.user?.displayName || 'no-user'}</div>;
  }

  it('provides auth state and auth actions', async () => {
    let contextValue;
    setAuthState(mockAuthUser);
    mockCreateUser.mockResolvedValue({ user: { uid: 'new-user' } });
    mockSignInWithPopup.mockResolvedValue({ user: { uid: 'popup-user' } });
    mockSignInWithEmail.mockResolvedValue({ user: { uid: 'email-user' } });
    mockSignOut.mockResolvedValue(undefined);

    render(
      <FirebaseContextProvider>
        <FirebaseProbe onReady={(value) => (contextValue = value)} />
      </FirebaseContextProvider>
    );

    expect(await screen.findByText('Gusti')).toBeInTheDocument();

    await expect(contextValue.signUpUserWithEmailAndPassword('a@b.com', 'secret')).resolves.toEqual(
      { uid: 'new-user' }
    );
    await expect(contextValue.handleSignInWithGoogle()).resolves.toEqual({ uid: 'popup-user' });
    await expect(contextValue.handleSignInWithFacebook()).resolves.toEqual({ uid: 'popup-user' });
    await expect(contextValue.handleSignInWithGithub()).resolves.toEqual({ uid: 'popup-user' });
    await expect(contextValue.handleSignInWithTwitter()).resolves.toEqual({ uid: 'popup-user' });
    await expect(
      contextValue.handleSignInWithEmailAndPassword('a@b.com', 'secret')
    ).resolves.toEqual({ uid: 'email-user' });
    await expect(contextValue.handleSignOut()).resolves.toBeUndefined();

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    expect(mockCreateUser).toHaveBeenCalled();
    expect(mockSignInWithPopup).toHaveBeenCalledTimes(4);
    expect(mockSignInWithEmail).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('rethrows auth action errors', async () => {
    let contextValue;
    setAuthState(null);
    mockCreateUser.mockRejectedValue(new Error('signup failed'));
    mockSignInWithPopup.mockRejectedValue(new Error('popup failed'));
    mockSignInWithEmail.mockRejectedValue(new Error('email failed'));
    mockSignOut.mockRejectedValue(new Error('signout failed'));

    render(
      <FirebaseContextProvider>
        <FirebaseProbe onReady={(value) => (contextValue = value)} />
      </FirebaseContextProvider>
    );

    expect(await screen.findByText('no-user')).toBeInTheDocument();

    await expect(contextValue.signUpUserWithEmailAndPassword('a@b.com', 'secret')).rejects.toThrow(
      'signup failed'
    );
    await expect(contextValue.handleSignInWithGoogle()).rejects.toThrow('popup failed');
    await expect(
      contextValue.handleSignInWithEmailAndPassword('a@b.com', 'secret')
    ).rejects.toThrow('email failed');
    await expect(contextValue.handleSignOut()).rejects.toThrow('signout failed');
  });
});

describe('WishlistContext', () => {
  function WishlistProbe() {
    const {
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
    } = useWishlist();

    return (
      <div>
        <span data-testid="wishlist-count">{wishlist.wishlistItems.length}</span>
        <span data-testid="is-in-wishlist">{isInWishlist('p1') ? 'yes' : 'no'}</span>
        <button type="button" onClick={() => addToWishlist(product)}>
          add
        </button>
        <button type="button" onClick={() => removeFromWishlist('p1')}>
          remove
        </button>
        <button type="button" onClick={() => toggleWishlist(product)}>
          toggle
        </button>
        <button type="button" onClick={() => clearWishlist()}>
          clear
        </button>
      </div>
    );
  }

  function renderWishlist(user) {
    setAuthState(user);
    return render(
      <FirebaseContextProvider>
        <WishlistProvider>
          <WishlistProbe />
        </WishlistProvider>
      </FirebaseContextProvider>
    );
  }

  it('throws when useWishlist is used outside provider', () => {
    const BadConsumer = () => {
      useWishlist();
      return null;
    };

    expect(() => render(<BadConsumer />)).toThrow(
      'useWishlist must be used within a WishlistProvider'
    );
  });

  it('warns when adding wishlist item without login', async () => {
    renderWishlist(null);

    expect(await screen.findByTestId('wishlist-count')).toHaveTextContent('0');
    fireEvent.click(screen.getByText('add'));

    await waitFor(() =>
      expect(toast.warn).toHaveBeenCalledWith('Please sign in to add items to your wishlist.')
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('fetches wishlist, adds, removes, toggles, and clears items', async () => {
    const getIdToken = jest.fn().mockResolvedValue('token');
    const loggedInUser = { uid: 'user-1', displayName: 'Gusti', getIdToken };

    global.fetch
      .mockResolvedValueOnce(
        mockJsonResponse({
          wishlist: {
            wishlistItems: [{ ...product, product: 'p1' }],
          },
        })
      )
      .mockResolvedValueOnce(
        mockJsonResponse({
          wishlist: {
            wishlistItems: [
              { ...product, product: 'p1' },
              { ...product, product: 'p2', _id: 'p2' },
            ],
          },
        })
      )
      .mockResolvedValueOnce(mockJsonResponse({ wishlist: { wishlistItems: [] } }))
      .mockResolvedValueOnce(mockJsonResponse({ wishlist: { wishlistItems: [] } }))
      .mockResolvedValueOnce(mockJsonResponse({ wishlist: { wishlistItems: [] } }));

    renderWishlist(loggedInUser);

    await waitFor(() => expect(screen.getByTestId('wishlist-count')).toHaveTextContent('1'));
    expect(screen.getByTestId('is-in-wishlist')).toHaveTextContent('yes');

    fireEvent.click(screen.getByText('add'));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Gaming Laptop has been added to your wishlist.')
    );

    fireEvent.click(screen.getByText('remove'));
    await waitFor(() => expect(toast.info).toHaveBeenCalledWith('Item removed from wishlist.'));

    fireEvent.click(screen.getByText('toggle'));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/wishlist',
        expect.objectContaining({ method: 'POST' })
      )
    );

    fireEvent.click(screen.getByText('clear'));
    await waitFor(() => expect(toast.info).toHaveBeenCalledWith('Wishlist cleared successfully.'));

    expect(getIdToken).toHaveBeenCalled();
  });

  it('handles wishlist API failures', async () => {
    const getIdToken = jest.fn().mockResolvedValue('token');
    const loggedInUser = { uid: 'user-1', displayName: 'Gusti', getIdToken };

    global.fetch
      .mockRejectedValueOnce(new Error('fetch failed'))
      .mockResolvedValueOnce(mockJsonResponse({ error: 'bad request' }, 400))
      .mockResolvedValueOnce(mockJsonResponse({ error: 'remove failed' }, 500))
      .mockRejectedValueOnce(new Error('clear failed'));

    renderWishlist(loggedInUser);

    await waitFor(() => expect(screen.getByTestId('wishlist-count')).toHaveTextContent('0'));

    fireEvent.click(screen.getByText('add'));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to add item to wishlist')
      )
    );

    fireEvent.click(screen.getByText('remove'));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to remove item from wishlist.')
    );

    fireEvent.click(screen.getByText('clear'));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('An error occurred while clearing your wishlist.')
    );
  });
});
