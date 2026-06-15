/**
 * LogIn component handles user login functionality, including email/password login, Google sign-in, and Twitter sign-in.
 * Uses Firebase authentication methods for user authentication.
 * Displays login form, input fields, and authentication buttons.
 */
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFirebaseAppContext } from '../context/FirebaseContext';
import Styles from '../style/LoginSingnup.module.css';

/**
 * LogIn component handles user login functionality, including email/password login, Google sign-in, and Twitter sign-in.
 * Uses Firebase authentication methods for user authentication.
 * Displays login form, input fields, and authentication buttons.
 */

/**
 * LogIn component handles user login functionality, including email/password login, Google sign-in, and Twitter sign-in.
 * Uses Firebase authentication methods for user authentication.
 * Displays login form, input fields, and authentication buttons.
 */

/**
 * LogIn component handles user login functionality, including email/password login, Google sign-in, and Twitter sign-in.
 * Uses Firebase authentication methods for user authentication.
 * Displays login form, input fields, and authentication buttons.
 */

/**
 * LogIn component handles user login functionality, including email/password login, Google sign-in, and Twitter sign-in.
 * Uses Firebase authentication methods for user authentication.
 * Displays login form, input fields, and authentication buttons.
 */

const LogIn = () => {
  const { handleSignInWithGoogle, handleSignInWithEmailAndPassword, handleSignInWithTwitter } =
    useFirebaseAppContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const notify = (str) => toast(str);

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      await handleSignInWithEmailAndPassword(email, password);

      notify('Berhasil Masuk! Selamat Berbelanja 🇮🇩');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login page error:', err.code, err.message);
      notify(err.message || 'Gagal Masuk');
    }
  };

  return (
    <>
      <div className="flex h-[85vh] bg-gradient-to-r from-red-50 to-white">
        <div className="m-auto rounded-xl w-[95%] h-[95%] md:w-3/5 md:h-3/4 flex flex-col md:flex-row justify-center shadow-2xl overflow-hidden">
          {/* Image section */}
          <div className="w-[100%] md:w-1/2 h-[40%] md:h-full flex justify-center content-center bg-gradient-to-br from-red-600 to-red-700">
            <img
              src="https://www.cloudways.com/blog/wp-content/uploads/Ecommerce-Shopping-Infographics.png"
              className="w-full"
              alt="Ecommerce"
            />
          </div>

          {/* Login form section */}
          <div className="w-[100%] md:w-1/2 h-2/3 md:h-full rounded-e-xl text-white">
            <div className={Styles.loginPage}>
              <div className="w-full">
                <h1>Selamat Datang di Ecom-Web</h1>
                <h4>Rayakan Kemerdekaan dengan Berbelanja Cerdas! Masuk untuk melanjutkan</h4>

                <form className="mt-4" onSubmit={loginHandler}>
                  {/* Email input */}
                  <div className="mb-3">
                    <label htmlFor="email" className={Styles.label}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Masukkan email Anda"
                      className={Styles.inputfield}
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </div>

                  {/* Password input */}
                  <div className="mb-3 relative">
                    <label htmlFor="password" className={Styles.label}>
                      Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="*******"
                      className={Styles.inputfield}
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                    <span onClick={() => setShowPassword((show) => !show)} className={Styles.eye}>
                      👁
                    </span>
                  </div>

                  {/* Remember me and Forgot password links */}
                  <div className="mb-3 flex flex-wrap content-center justify-between">
                    <div className="flex flex-row gap-2">
                      <input id="remember" type="checkbox" className="mr-1 checked:bg-red-600" />
                      <label htmlFor="remember" className={Styles.label2}>
                        Ingat Saya
                      </label>
                    </div>

                    <a href="#" className={Styles.forget}>
                      Lupa Password?
                    </a>
                  </div>

                  {/* Sign-in buttons */}
                  <div className="mb-3">
                    <button type="submit" className={Styles.signinbtn}>
                      🔓 Masuk Sekarang
                    </button>

                    <button
                      type="button"
                      className={Styles.authbtn}
                      onClick={handleSignInWithGoogle}
                    >
                      <img
                        className={Styles.iconimg}
                        src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                        alt="Google icon"
                      />
                      Masuk dengan Google
                    </button>

                    <button
                      type="button"
                      className={Styles.authbtn}
                      onClick={handleSignInWithTwitter}
                    >
                      Masuk dengan Twitter
                    </button>
                  </div>
                </form>

                {/* Sign-up link */}
                <div className="text-center">
                  <span className="text-xs text-red-600 font-semibold">
                    Belum punya akun?
                  </span>
                  <Link href="/signup" className={Styles.forget} data-cy="signup-link">
                    Daftar Sekarang
                  </Link>
                </div>
              </div>

              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
