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
      notify('Silakan masukkan semua field');
      return;
    }
    if (password !== confirmPassword) {
      notify('Password dan Konfirmasi Password tidak cocok');
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
      notify('Pendaftaran berhasil! Selamat bergabung 🇮🇩');
    } catch (error) {
      console.error('Firebase Signup Error:', error);
      notify('Kesalahan selama pendaftaran. Silakan coba lagi.');
    }
  };

  return (
    <>
      <div className="flex h-[90vh] bg-gradient-to-r from-red-50 to-white">
        <div className="m-auto bg-gradient-to-br from-red-100 to-red-50 rounded-xl w-[95%] h-[95%] md:w-3/5 md:h-3/4 flex flex-col md:flex-row justify-center shadow-2xl overflow-hidden">
          <div className="w-[100%] md:w-1/2 h-[40%] md:h-full flex justify-center content-center bg-gradient-to-br from-red-600 to-red-700">
            <img
              src="https://plus.unsplash.com/premium_photo-1684785618727-378a3a5e91c5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWNvbW1lcmNlfGVufDB8fDB8fHww"
              className="w-full"
              alt="Ecommerce"
            />
          </div>

          <div className=" w-[100%] md:w-1/2  h-2/3 md:h-full rounded-e-xl text-white">
            <div className={Styles.loginPage}>
              <div className="w-full">
                <h1>🇮🇩 Daftar di Ecom-Web 🇮🇩</h1>
                <h4>Bergabunglah dengan kami dan rayakan kemerdekaan dengan penawaran terbaik!</h4>

                <form className="mt-4" onSubmit={submitHandler}>
                  <div className="mb-3">
                    <label htmlFor="name" className={Styles.label}>
                      Nama Pengguna
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Masukkan nama Anda"
                      className={Styles.inputfield}
                      onChange={handleUsernameChange}
                      value={username}
                    />
                    {userNameError && <span className="text-red-600 text-xs font-semibold">{userNameError}</span>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className={Styles.label}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Masukkan email Anda"
                      className={Styles.inputfield}
                      onChange={handleEmailChange}
                      value={email}
                    />
                    {emailError && <span className="text-red-600 text-xs font-semibold">{emailError}</span>}
                  </div>
                  <div className="mb-3 relative">
                    <label htmlFor="password" className={Styles.label}>
                      Password
                    </label>
                    <input
                      data-cy="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="Masukkan Password"
                      className={Styles.inputfield}
                      onChange={handlePasswordChange}
                      value={password}
                    />
                    {passwordError && (
                      <span className="text-red-600 text-xs font-semibold block">{passwordError}</span>
                    )}
                    <span onClick={() => setShowPassword((show) => !show)} className={Styles.eye}>
                      👁
                    </span>
                  </div>
                  <div className="mb-3 relative">
                    <label htmlFor="confirm_password" className={Styles.label}>
                      Konfirmasi Password
                    </label>
                    <input
                      data-cy="signup-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      id="confirm_password"
                      placeholder="Konfirmasi Password"
                      className={Styles.inputfield}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span onClick={() => setShowPassword((show) => !show)} className={Styles.eye}>
                      👁
                    </span>
                  </div>

                  <div className="my-4">
                    <button type="submit" className={Styles.signinbtn} data-cy="signup-submit">
                      ✅ Daftar Sekarang
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <span className="text-xs text-red-600 font-semibold">
                    Sudah punya akun?
                  </span>
                  <Link href="/login">
                    <span className={Styles.forget}>Masuk Di Sini</span>
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
