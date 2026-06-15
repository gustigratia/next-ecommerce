'use client';

import Link from 'next/link';
import React, { useContext } from 'react';

import CartContext from '../context/CartContext';

const Cart = () => {
  const cartContext = useContext(CartContext) || {};

  const { addItemToCart = () => {}, deleteItemFromCart = () => {}, cart } = cartContext;

  const cartItems = Array.isArray(cart?.cartItems) ? cart.cartItems : [];

  const increaseQty = (cartItem) => {
    const newQty = Number(cartItem?.quantity || 0) + 1;

    if (newQty > Number(cartItem.stock)) return;

    const item = { ...cartItem, quantity: newQty };
    addItemToCart(item);
  };

  const decreaseQty = (cartItem) => {
    const newQty = Number(cartItem?.quantity || 0) - 1;

    if (newQty <= 0) return;

    const item = { ...cartItem, quantity: newQty };
    addItemToCart(item);
  };

  const amountWithoutTax = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  const taxAmount = amountWithoutTax * 0.15;
  const totalAmount = amountWithoutTax + taxAmount;

  return (
    <>
      <section className="py-5 sm:py-7 bg-gradient-to-r from-red-100 to-red-50 border-b-4 border-red-600">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-red-700 mb-2">🛒 {cartItems.length} Item(s) dalam Keranjang 🛒</h2>
          <p className="text-red-600 font-semibold">Selamat berbelanja! Rayakan kemerdekaan dengan penawaran terbaik kami</p>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="py-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="border-2 border-red-300 bg-white shadow-lg rounded p-8 text-center">
              <h3 className="text-2xl font-bold text-red-600 mb-3">Keranjang Belanja Kosong</h3>

              <p className="text-gray-600 mb-6 font-semibold">
                Sepertinya Anda belum menambahkan produk ke keranjang. Mari mulai berbelanja sekarang! 🇮🇩
              </p>

              <Link
                href="/"
                className="px-6 py-3 inline-block text-lg text-center font-semibold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 shadow-md hover:shadow-lg transition"
              >
                🛍️ Kembali Berbelanja 🛍️
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <main className="md:w-3/4">
                <article className="border-2 border-red-300 bg-white shadow-lg rounded mb-5 p-3 lg:p-5">
                  {cartItems.map((cartItem) => (
                    <div key={cartItem.product}>
                      <div className="flex flex-wrap lg:flex-row gap-5 mb-4 hover:bg-red-50 p-2 rounded transition">
                        <div className="w-full lg:w-2/5 xl:w-2/4">
                          <figure className="flex leading-5">
                            <div>
                              <div className="block w-16 h-16 rounded border-2 border-red-300 overflow-hidden shadow-md">
                                <img src={cartItem.image} alt={cartItem.name} />
                              </div>
                            </div>

                            <figcaption className="ml-3">
                              <p>
                                <span className="hover:text-red-600 font-semibold">{cartItem.name}</span>
                              </p>
                              <p className="mt-1 text-gray-500">Penjual: {cartItem.seller}</p>
                            </figcaption>
                          </figure>
                        </div>

                        <div className="w-24">
                          <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                            <button
                              data-action="decrement"
                              className="bg-red-300 text-red-700 hover:text-white hover:bg-red-600 h-full w-20 rounded-l cursor-pointer outline-none font-bold transition"
                              onClick={() => decreaseQty(cartItem)}
                            >
                              <span className="m-auto text-2xl font-thin">−</span>
                            </button>

                            <input
                              type="number"
                              className="outline-none focus:outline-none text-center w-full bg-red-100 font-semibold text-md hover:text-red-700 focus:text-red-700 md:text-base cursor-default flex items-center text-red-600 custom-input-number"
                              name="custom-input-number"
                              value={cartItem.quantity}
                              readOnly
                            />

                            <button
                              data-action="increment"
                              className="bg-red-300 text-red-700 hover:text-white hover:bg-red-600 h-full w-20 rounded-r cursor-pointer font-bold transition"
                              onClick={() => increaseQty(cartItem)}
                            >
                              <span className="m-auto text-2xl font-thin">+</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="leading-5">
                            <p className="font-bold text-red-600">
                              £
                              {(
                                Number(cartItem.price || 0) * Number(cartItem.quantity || 0)
                              ).toFixed(2)}
                            </p>
                            <small className="text-gray-500">£{cartItem.price} / per item</small>
                          </div>
                        </div>

                        <div className="flex-auto">
                          <div className="float-right">
                            <button
                              className="px-4 py-2 inline-block text-white bg-red-600 shadow-md border border-red-600 rounded-md hover:bg-red-700 cursor-pointer font-semibold transition"
                              onClick={() => deleteItemFromCart(cartItem?.product)}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>

                      <hr className="my-4 border-red-200" />
                    </div>
                  ))}
                </article>
              </main>

              <aside className="md:w-1/4">
                <article className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-white shadow-lg rounded mb-5 p-3 lg:p-5">
                  <h3 className="text-lg font-bold text-red-600 mb-4">📊 Ringkasan Pembelian</h3>
                  <ul className="mb-5 space-y-2">
                    <li className="flex justify-between text-gray-700 font-semibold">
                      <span>Subtotal:</span>
                      <span className="text-red-600">£{amountWithoutTax.toFixed(2)}</span>
                    </li>

                    <li className="flex justify-between text-gray-700 font-semibold">
                      <span>Total Item:</span>
                      <span className="text-red-600">
                        {cartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0)}{' '}
                        (Produk)
                      </span>
                    </li>

                    <li className="flex justify-between text-gray-700 font-semibold">
                      <span>Pajak (15%):</span>
                      <span className="text-red-600">£{taxAmount.toFixed(2)}</span>
                    </li>

                    <li className="text-lg font-bold border-t-2 border-red-300 flex justify-between mt-4 pt-3 text-red-700">
                      <span>Total Harga:</span>
                      <span>£{totalAmount.toFixed(2)}</span>
                    </li>
                  </ul>
                  {/* Continue button */}
                  <Link
                  href="/checkout"
                  className="px-4 py-3 mb-2 inline-block text-lg w-full text-center font-bold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 shadow-md hover:shadow-lg transition"
                  >
                  ✅ Lanjutkan ke Checkout
                  </Link>
                  {/* Back to shop button */}
                  <Link
                    href="/"
                    className="px-4 py-3 inline-block text-lg w-full text-center font-semibold text-red-600 bg-white shadow-md border-2 border-red-300 rounded-md hover:bg-red-50 transition"
                  >
                    🛍️ Lanjut Belanja
                  </Link>
                </article>
              </aside>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;
