'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useFirebaseAppContext } from '../context/FirebaseContext';

const ORDER_DETAIL_BASE_PATH = '/orders';

const OrderList = () => {
  const router = useRouter();
  const { user, loading, handleSignOut } = useFirebaseAppContext();

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    });
  }, []);

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getOrderId = (order) => {
    return order?._id || order?.id || '';
  };

  const getShortOrderId = (order) => {
    const id = getOrderId(order);

    return id ? `#${id.toString().slice(-6).toUpperCase()}` : '-';
  };

  const getTotalItems = (order) => {
    const items = order?.orderItems || order?.cartItems || order?.items || [];

    return items.reduce((total, item) => total + Number(item.quantity || item.qty || 1), 0);
  };

  const getStatusClass = (status) => {
    if (status === 'Delivered') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'Cancelled') {
      return 'bg-red-100 text-red-700';
    }

    if (status === 'Processing') {
      return 'bg-yellow-100 text-yellow-700';
    }

    return 'bg-blue-100 text-blue-700';
  };

  const getDetailHref = (order) => {
    const id = getOrderId(order);

    return `${ORDER_DETAIL_BASE_PATH}/${id}`;
  };

  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;

    setIsLoadingOrders(true);
    setError('');

    try {
      const token = await user.getIdToken();

      const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await res.json();
      const fetchedOrders = Array.isArray(data) ? data : data.orders || [];

      const sortedOrders = fetchedOrders.sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [loading, user, router, fetchOrders]);

  if (loading || isLoadingOrders) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-10">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4 bg-white shadow-md rounded-md p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-6 text-gray-800">My Account</h2>

            <nav className="flex flex-col space-y-4">
              <Link href="/userProfile" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>

              <Link href="/orderlist" className="text-blue-600 font-medium hover:underline">
                My Orders
              </Link>

              <Link href="#" className="text-gray-600 hover:text-blue-600">
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
              type="button"
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
                <p className="text-sm text-gray-500 mt-1">
                  View your order history and check order status.
                </p>
              </div>

              <Link
                href="/productList"
                className="inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="mt-2 text-sm font-medium underline"
                >
                  Retry
                </button>
              </div>
            )}

            {orders.length === 0 ? (
              <div className="text-center py-14">
                <div className="text-5xl mb-4">🛒</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h2>
                <p className="text-gray-500 mb-6">You have not placed any orders yet.</p>

                <Link
                  href="/productList"
                  className="inline-flex px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm">
                      <th className="py-3 px-4 font-medium border-b">Order ID</th>
                      <th className="py-3 px-4 font-medium border-b">Date</th>
                      <th className="py-3 px-4 font-medium border-b">Items</th>
                      <th className="py-3 px-4 font-medium border-b">Status</th>
                      <th className="py-3 px-4 font-medium border-b">Total</th>
                      <th className="py-3 px-4 font-medium border-b text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-gray-700">
                    {orders.map((order) => (
                      <tr
                        key={getOrderId(order)}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-blue-600">
                          {getShortOrderId(order)}
                        </td>

                        <td className="py-4 px-4">{formatDate(order.createdAt)}</td>

                        <td className="py-4 px-4">{getTotalItems(order)} item(s)</td>

                        <td className="py-4 px-4">
                          <span
                            className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusClass(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus || 'Pending'}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-semibold">
                          {formatCurrency.format(Number(order.totalAmount || 0))}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <Link
                            href={getDetailHref(order)}
                            className="inline-flex px-3 py-1.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            View Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderList;
