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

      notify('Login Successfully');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login page error:', err.code, err.message);
      notify(err.message || 'Login failed');
    }
  };

  return (
    <>
      <div className="flex h-[85vh] bg-white">
        <div className="m-auto rounded-xl w-[95%] h-[95%] md:w-3/5 md:h-3/4 flex flex-col md:flex-row justify-center">
          {/* Image section */}
          <div className="w-[100%] md:w-1/2 h-[40%] md:h-full flex justify-center content-center">
            <img
              src="https://www.cloudways.com/blog/wp-content/uploads/Ecommerce-Shopping-Infographics.png"
              className="w-full rounded-s-xl"
              alt="logo_img"
            />
          </div>

          {/* Login form section */}
          <div className="w-[100%] md:w-1/2 h-2/3 md:h-full rounded-e-xl text-white">
            <div className={Styles.loginPage}>
              <div className="w-full">
                <h1 className="text-red-800">Welcome To Ecommerce Site</h1>
                <h4>Welcome back! Please enter your Login Credentials</h4>

                <form className="mt-4" onSubmit={loginHandler}>
                  {/* Email input */}
                  <div className="mb-3">
                    <label htmlFor="email" className={Styles.label}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
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
                      <input id="remember" type="checkbox" className="mr-1 checked:bg-purple-700" />
                      <label htmlFor="remember" className={Styles.label2}>
                        Remember me
                      </label>
                    </div>

                    <a href="#" className={Styles.forget}>
                      Forgot password?
                    </a>
                  </div>

                  {/* Sign-in buttons */}
                  <div className="mb-3">
                    <button type="submit" className={Styles.signinbtn}>
                      Sign in
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
                      Sign in with Google
                    </button>

                    <button
                      type="button"
                      className={Styles.authbtn}
                      onClick={handleSignInWithTwitter}
                    >
                      <img
                        className={Styles.iconimg}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/220px-Logo_of_Twitter.svg.png"
                        alt="Twitter icon"
                      />
                      Sign in with Twitter
                    </button>
                  </div>
                </form>

                {/* Sign-up link */}
                <div className="text-center">
                  <span className="text-xs text-gray-400 font-semibold">
                    Don't have an account?
                  </span>
                  <Link href="/signup">
                    <span className={Styles.forget}>Sign up</span>
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
