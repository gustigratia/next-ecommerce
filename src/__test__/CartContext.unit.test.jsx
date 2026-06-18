import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CartContext from '@/app/context/CartContext';

// Prevent real Firebase initialization during unit tests by mocking the Firebase context
jest.mock('@/app/context/FirebaseContext', () => ({
  useFirebaseAppContext: jest.fn(() => ({ user: null, loading: false })),
}));

function TestProvider({ children }) {
  return <CartContext.Provider value={children} />;
}

describe('CartContext implementation', () => {
  it('provides a valid context object', () => {
    const Dummy = () => {
      const context = React.useContext(CartContext);
      return <div>{context ? 'has-context' : 'no-context'}</div>;
    };

    render(
      <CartContext.Provider value={{ cart: { cartItems: [] } }}>
        <Dummy />
      </CartContext.Provider>
    );

    expect(screen.getByText('has-context')).toBeInTheDocument();
  });
});
