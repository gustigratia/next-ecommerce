"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useFirebaseAppContext } from "@/app/context/FirebaseContext";

const OrderDetails = ({ orderId }) => {
  const { user, loading } = useFirebaseAppContext();

  const [order, setOrder] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (loading) return;

        if (!user) {
          setError("Please login first to view this order.");
          setPageLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const res = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load order");
          setPageLoading(false);
          return;
        }

        setOrder(data.order);
        setPageLoading(false);
      } catch (error) {
        console.error("Fetch order error:", error);
        setError("Something went wrong while loading the order.");
        setPageLoading(false);
      }
    };

    fetchOrder();
  }, [user, loading, orderId]);

  if (pageLoading) {
    return (
      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <p>Loading order...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="border border-gray-200 bg-white shadow-sm rounded p-6">
            <p className="text-red-600 mb-4">{error}</p>

            <Link
              href="/"
              className="px-4 py-3 inline-block text-white bg-red-800 rounded-md hover:bg-yellow-700"
            >
              Back to shop
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-5 sm:py-7 bg-yellow-100">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p className="text-gray-600">
            Thank you. Your order has been placed successfully.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <main className="lg:col-span-2">
              <article className="border border-gray-200 bg-white shadow-sm rounded p-5 lg:p-6 mb-5">
                <h3 className="text-xl font-semibold mb-4">Order Items</h3>

                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex gap-4 border-b border-gray-200 pb-4"
                    >
                      <div className="w-20 h-20 rounded border border-gray-200 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-gray-400">Seller: {item.seller}</p>
                        <p className="text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="border border-gray-200 bg-white shadow-sm rounded p-5 lg:p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Shipping Information
                </h3>

                <p className="mb-1">
                  <span className="font-medium">Name:</span>{" "}
                  {order.shippingInfo.fullName}
                </p>

                <p className="mb-1">
                  <span className="font-medium">Phone:</span>{" "}
                  {order.shippingInfo.phone}
                </p>

                <p className="mb-1">
                  <span className="font-medium">Address:</span>{" "}
                  {order.shippingInfo.address}
                </p>

                <p className="mb-1">
                  <span className="font-medium">City:</span>{" "}
                  {order.shippingInfo.city}
                </p>

                <p className="mb-1">
                  <span className="font-medium">Postal Code:</span>{" "}
                  {order.shippingInfo.postalCode}
                </p>

                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {order.shippingInfo.country}
                </p>
              </article>
            </main>

            <aside>
              <article className="border border-gray-200 bg-white shadow-sm rounded p-5 lg:p-6">
                <h3 className="text-xl font-semibold mb-4">Summary</h3>

                <ul className="mb-5">
                  <li className="flex justify-between text-gray-600 mb-1 gap-4">
                    <span>Order ID:</span>
                    <span className="text-right text-sm break-all">
                      {order._id}
                    </span>
                  </li>

                  <li className="flex justify-between text-gray-600 mb-1">
                    <span>Status:</span>
                    <span className="text-green-600">{order.orderStatus}</span>
                  </li>

                  <li className="flex justify-between text-gray-600 mb-1">
                    <span>Payment:</span>
                    <span>{order.paymentInfo.method}</span>
                  </li>

                  {order.paymentInfo.method === "Card" && (
                    <li className="flex justify-between text-gray-600 mb-1">
                      <span>Card:</span>
                      <span>**** {order.paymentInfo.cardLast4}</span>
                    </li>
                  )}

                  <li className="flex justify-between text-gray-600 mb-1">
                    <span>Amount before Tax:</span>
                    <span>₹{order.amountWithoutTax}</span>
                  </li>

                  <li className="flex justify-between text-gray-600 mb-1">
                    <span>TAX:</span>
                    <span>₹{order.taxAmount}</span>
                  </li>

                  {order.voucherInfo && (
                    <li className="flex justify-between text-red-600 font-medium mb-1">
                      <span>Discount ({order.voucherInfo.code}):</span>
                      <span>-₹{order.discountAmount}</span>
                    </li>
                  )}

                  <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
                    <span>Total price:</span>
                    <span>₹{order.totalAmount}</span>
                  </li>
                </ul>

                <Link
                  href="/"
                  className="px-4 py-3 inline-block text-lg w-full text-center font-medium text-white bg-red-800 border border-transparent rounded-md hover:bg-yellow-700"
                >
                  Continue Shopping
                </Link>
              </article>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetails;