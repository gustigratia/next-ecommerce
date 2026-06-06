'use client';

import React from 'react';

import { useFirebaseAppContext } from '../context/FirebaseContext';

const Profile = () => {
  const { user, handleSignOut } = useFirebaseAppContext();

  if (!user) {
    // You can render a loading indicator if the data is not yet fetched
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <div className="text-center">
        <img
          src={
            user.photoURL ||
            'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'
          }
          alt="User Avatar"
          className="rounded-full mx-auto mb-4 h-20 w-20"
        />
        <h1 className="text-3xl font-semibold mb-2">Welcome, {user.displayName || user.email}!</h1>
        <p className="text-gray-600">Email: {user.email}</p>
        {/* Add more details based on your Firebase user data structure */}
      </div>

      <hr className="my-6 border-t border-gray-300" />

      <div className="text-center">
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
