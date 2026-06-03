'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFirebaseAppContext } from '../context/FirebaseContext';
import Styles from '../style/LoginSingnup.module.css';

const SignUp = () => {
  const { signUpUserWithEmailAndPassword } = useFirebaseAppContext();

  const notify = (str) => toast(str);

  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userNameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (username.length > 4 && username.match(/[^\w\s]/)) {
      setUserNameError('Username should not have special characters');
    } else {
      setUserNameError('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (
      email.length > 6 &&
      !email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    ) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!e.target.value.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)) {
      setPasswordError(
        'Password must contain at least 8 characters, one letter, one number, and one special character.'
      );
    } else {
      setPasswordError('');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      notify('Please enter all fields');
      return;
    }
    if (password !== confirmPassword) {
      notify('Password and Confirm Password do not match');
      return;
    }
    try {
      // Sign up the user with Firebase
      await signUpUserWithEmailAndPassword(email, password);
      // If signup is successful, store user data in localStorage (Note: This is just for demonstration, not recommended for sensitive information)
      const user = { username, email };
      localStorage.setItem('USER', JSON.stringify(user));
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      notify('Registered successfully');
    } catch (error) {
      console.error('Firebase Signup Error:', error);
      notify('Error during registration. Please try again.');
    }
  };

  return (
    <>
      <div className="flex h-[90vh] bg-white">
        <div className="m-auto bg-slate-50 rounded-xl w-[95%] h-[95%] md:w-3/5 md:h-3/4 flex flex-col md:flex-row justify-center">
          <div className="w-[100%] md:w-1/2 h-[40%] md:h-full flex justify-center content-center">
            <img
              src="https://plus.unsplash.com/premium_photo-1684785618727-378a3a5e91c5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWNvbW1lcmNlfGVufDB8fDB8fHww"
              className="w-full rounded-s-xl"
              alt="logo_img"
            />
          </div>

          <div className=" w-[100%] md:w-1/2  h-2/3 md:h-full rounded-e-xl text-white">
            <div className={Styles.loginPage}>
              <div className="w-full">
                <h1 className="text-red-700">Welcome To Waste to Wealth</h1>
                <h4>Register here to Join Us</h4>

                <form className="mt-4" onSubmit={submitHandler}>
                  <div className="mb-3">
                    <label htmlFor="name" className={Styles.label}>
                      User name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your name"
                      className={Styles.inputfield}
                      onChange={handleUsernameChange}
                      value={username}
                    />
                    {userNameError && <span className="text-red-800 text-xs">{userNameError}</span>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className={Styles.label}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className={Styles.inputfield}
                      onChange={handleEmailChange}
                      value={email}
                    />
                    {emailError && <span className="text-red-800 text-xs">{emailError}</span>}
                  </div>
                  <div className="mb-3 relative">
                    <label htmlFor="password" className={Styles.label}>
                      Password
                    </label>
                    <input
                      type={showPassword ? 'password' : 'text'}
                      id="password"
                      placeholder="Password"
                      className={Styles.inputfield}
                      onChange={handlePasswordChange}
                      value={password}
                    />
                    {passwordError && (
                      <span className="text-red-800 text-xs block">{passwordError}</span>
                    )}
                    <span onClick={() => setShowPassword((show) => !show)} className={Styles.eye}>
                      👁
                    </span>
                  </div>
                  <div className="mb-3 relative">
                    <label htmlFor="confirm_password" className={Styles.label}>
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'password' : 'text'}
                      id="confirm_password"
                      placeholder="Confirm Password "
                      className={Styles.inputfield}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span onClick={() => setShowPassword((show) => !show)} className={Styles.eye}>
                      👁
                    </span>
                  </div>

                  <div className="my-4">
                    <button type="submit" className={Styles.signinbtn}>
                      Sign Up
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <span className="text-xs text-gray-400 font-semibold">
                    Have you alredy account?
                  </span>
                  <Link href="/login">
                    <span className={Styles.forget}>Sign In</span>
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

export default SignUp;
