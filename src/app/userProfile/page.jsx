'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useFirebaseAppContext } from '../context/FirebaseContext';

const Profile = () => {
  const { user, handleSignOut } = useFirebaseAppContext();

  // States for user profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // States for orders
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      // Set initial names from Firebase as fallback
      if (user.displayName) {
        const nameParts = user.displayName.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }

      const fetchData = async () => {
        setIsLoading(true);

        try {
          // Fetch user data from MongoDB
          const userRes = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);

          if (userRes.ok) {
            const userData = await userRes.json();

            if (userData.firstName) setFirstName(userData.firstName);
            if (userData.lastName) setLastName(userData.lastName);
            if (userData.phoneNumber) setPhoneNumber(userData.phoneNumber);
          }

          // Fetch orders from MongoDB
          const token = await user.getIdToken();

          const ordersRes = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();

            const fetchedOrders = Array.isArray(ordersData) ? ordersData : ordersData.orders || [];

            setOrders(fetchedOrders.slice(0, 5));
          } else {
            console.error('Failed to fetch orders:', ordersRes.status);
            setOrders([]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firstName,
          lastName,
          phoneNumber,
        }),
      });

      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-1/4 bg-white shadow-md rounded-md p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-6 text-gray-800">My Account</h2>
            <nav className="flex flex-col space-y-4">
              <Link href="#" className="text-blue-600 font-medium hover:underline">
                Dashboard
              </Link>
              <Link href="/orderlist" className="text-gray-600 hover:text-blue-600">
                My Orders
              </Link>
              <Link href="/wishlist" className="text-gray-600 hover:text-blue-600">
                Wishlist
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">
                Manage Addresses
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">
                Account Settings
              </Link>
            </nav>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="w-full md:w-3/4 space-y-6">
          {/* Profile Header Card */}
          <div className="bg-white shadow-md rounded-md p-6 flex flex-col md:flex-row items-center gap-6">
            <img
              src={
                user.photoURL ||
                'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'
              }
              alt="User Avatar"
              className="rounded-full h-24 w-24 object-cover border-2 border-gray-100 shadow-sm"
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                Welcome, {firstName || user.displayName || user.email}!
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Account Details Form */}
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Account Details
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSaveProfile}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                  value={user.email || ''}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none transition-colors disabled:bg-blue-400"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <Link href="/orderlist" className="text-sm text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="py-3 px-4 font-medium border-b">Order ID</th>
                    <th className="py-3 px-4 font-medium border-b">Date</th>
                    <th className="py-3 px-4 font-medium border-b">Status</th>
                    <th className="py-3 px-4 font-medium border-b">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">
                        No recent orders foundsssss .
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-blue-600">
                          #{order._id.toString().slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`py-1 px-3 rounded-full text-xs font-semibold ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-green-100 text-green-700'
                                : order.orderStatus === 'Cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
