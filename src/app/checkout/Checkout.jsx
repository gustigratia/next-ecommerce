"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CartContext from "../context/CartContext";
import { useFirebaseAppContext } from "../context/FirebaseContext";

const Checkout = () => {
  const router = useRouter();
  const { cart, clearCart } = useContext(CartContext);
  const { user, loading } = useFirebaseAppContext();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const cartItems = cart?.cartItems || [];

  const amountWithoutTax = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const taxAmount = Number((amountWithoutTax * 0.15).toFixed(2));
  const totalAmount = Number(amountWithoutTax + taxAmount).toFixed(2);
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }

    if (e.target.name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    if (e.target.name === "expiryDate") {
      value = value.replace(/[^\d/]/g, "").slice(0, 5);

      if (value.length === 2 && !value.includes("/")) {
        value = value + "/";
      }
    }

    setCardInfo({
      ...cardInfo,
      [e.target.name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (shippingInfo.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(shippingInfo.phone)) {
      newErrors.phone = "Phone number must contain 10 to 15 digits";
    }

    if (!shippingInfo.address.trim()) {
      newErrors.address = "Address is required";
    } else if (shippingInfo.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }

    if (!shippingInfo.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!/^[0-9]{4,10}$/.test(shippingInfo.postalCode)) {
      newErrors.postalCode = "Postal code must contain 4 to 10 digits";
    }

    if (!shippingInfo.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    if (paymentMethod === "Card") {
      if (!cardInfo.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^[0-9]{16}$/.test(cardInfo.cardNumber)) {
        newErrors.cardNumber = "Card number must contain 16 digits";
      }

      if (!cardInfo.cardName.trim()) {
        newErrors.cardName = "Name on card is required";
      } else if (cardInfo.cardName.trim().length < 3) {
        newErrors.cardName = "Name on card must be at least 3 characters";
      }

      if (!cardInfo.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardInfo.expiryDate)) {
        newErrors.expiryDate = "Expiry date must use MM/YY format";
      } else {
        const [month, year] = cardInfo.expiryDate.split("/");
        const expiry = new Date(`20${year}`, Number(month), 0);
        const today = new Date();

        if (expiry < today) {
          newErrors.expiryDate = "Card has expired";
        }
      }

      if (!cardInfo.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^[0-9]{3,4}$/.test(cardInfo.cvv)) {
        newErrors.cvv = "CVV must contain 3 or 4 digits";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (loading) {
        alert("Please wait. Checking your login status...");
        return;
    }

    if (!user) {
        alert("Please login first before placing an order.");
        router.push("/login");
        return;
    }

    if (cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const isValid = validateForm();

    if (!isValid) return;

    const token = await user.getIdToken();

    const paymentInfo =
        paymentMethod === "Card"
        ? {
            method: "Card",
            cardLast4: cardInfo.cardNumber.slice(-4),
            cardName: cardInfo.cardName,
            expiryDate: cardInfo.expiryDate,
            }
        : {
            method: "COD",
            };

    const orderData = {
        shippingInfo,
        paymentInfo,
        orderItems: cartItems,
        amountWithoutTax,
        taxAmount,
        totalAmount: Number(totalAmount),
    };

    try {
        const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (!res.ok) {
        alert(data.message || "Failed to place order");
        return;
        }

        await clearCart();

        router.push(`/orders/${data.order._id}`);
    } catch (error) {
        console.error("Place order error:", error);
        alert("Something went wrong while placing your order.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <section className="py-5 sm:py-7 bg-yellow-100">
          <div className="container max-w-screen-xl mx-auto px-4">
            <h2 className="text-xl font-semibold mb-2">Checkout</h2>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="border border-gray-200 bg-white shadow-sm rounded p-8 text-center">
              <h3 className="text-2xl font-semibold mb-3">
                Your cart is empty
              </h3>

              <p className="text-gray-500 mb-6">
                Please add products to your cart before checkout.
              </p>

              <Link
                href="/"
                className="px-5 py-3 inline-block text-white bg-red-800 rounded-md hover:bg-yellow-700"
              >
                Back to shop
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="py-5 sm:py-7 bg-yellow-100">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-2">Checkout</h2>
          <p className="text-gray-600">
            Complete your shipping and payment details
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <form
            onSubmit={handlePlaceOrder}
            className="flex flex-col lg:flex-row gap-5"
          >
            <main className="lg:w-3/4">
              <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-5 lg:p-6">
                <h3 className="text-xl font-semibold mb-5">
                  Shipping Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      placeholder="Enter your phone number"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      rows="4"
                      placeholder="Enter your complete address"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      placeholder="Enter your city"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleShippingChange}
                      placeholder="Enter postal code"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                    />
                    {errors.postalCode && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      placeholder="Enter your country"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                    />
                    {errors.country && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </article>

              <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-5 lg:p-6">
                <h3 className="text-xl font-semibold mb-5">Payment Method</h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>
                      <span className="block font-medium">
                        Cash on Delivery
                      </span>
                      <span className="block text-sm text-gray-500">
                        Pay when the product arrives
                      </span>
                    </span>
                  </label>

                  <label className="flex items-center gap-3 border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={paymentMethod === "Card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>
                      <span className="block font-medium">
                        Credit / Debit Card
                      </span>
                      <span className="block text-sm text-gray-500">
                        Pay securely using your card
                      </span>
                    </span>
                  </label>

                  {paymentMethod === "Card" && (
                    <div className="border border-gray-200 rounded-md p-5 bg-gray-50">
                      <h4 className="font-semibold mb-4">Card Details</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block mb-1 font-medium text-gray-700">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardInfo.cardNumber}
                            onChange={handleCardChange}
                            placeholder="1234567812345678"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                          />
                          {errors.cardNumber && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block mb-1 font-medium text-gray-700">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={cardInfo.cardName}
                            onChange={handleCardChange}
                            placeholder="Enter name on card"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                          />
                          {errors.cardName && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.cardName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-1 font-medium text-gray-700">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                          />
                          {errors.expiryDate && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-1 font-medium text-gray-700">
                            CVV
                          </label>
                          <input
                            type="password"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-red-800"
                          />
                          {errors.cvv && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.paymentMethod && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>
              </article>
            </main>

            <aside className="lg:w-1/4">
              <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-5 lg:p-6">
                <h3 className="text-xl font-semibold mb-5">Order Summary</h3>

                <div className="space-y-4 mb-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex gap-3 border-b border-gray-200 pb-4"
                    >
                      <div className="w-16 h-16 rounded border border-gray-200 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium leading-5">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          Seller: {item.seller}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="font-semibold">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <ul className="mb-5">
                  <li className="flex justify-between text-gray-600 mb-1">
                    <span>Amount before Tax:</span>
                    <span>₹{amountWithoutTax}</span>
                  </li>

                  <li className="flex justify-between text-gray-600 mb-1">
                    <span>Total Units:</span>
                    <span className="text-green-500">{totalUnits} (Units)</span>
                  </li>

                  <li className="flex justify-between text-gray-600 mb-1">
                    <span>TAX:</span>
                    <span>₹{taxAmount}</span>
                  </li>

                  <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
                    <span>Total price:</span>
                    <span>₹{totalAmount}</span>
                  </li>
                </ul>

                <button
                  type="submit"
                  className="px-4 py-3 mb-2 inline-block text-lg w-full text-center font-medium text-white bg-red-800 border border-transparent rounded-md hover:bg-yellow-700 cursor-pointer"
                >
                  Place Order
                </button>

                <Link
                  href="/cart"
                  className="px-4 py-3 inline-block text-lg w-full text-center font-medium text-green-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100"
                >
                  Back to cart
                </Link>
              </article>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;