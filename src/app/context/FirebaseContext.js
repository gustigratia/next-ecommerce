'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { firebaseApp } from './firebaseConfig';

const AppContext = createContext(null);

export const useFirebaseAppContext = () => {
  return useContext(AppContext);
};

const firebaseAuth = getAuth(firebaseApp);

const FirebaseContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log('Auth state changed:', currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpUserWithEmailAndPassword = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      console.log('Sign up success:', result.user);
      return result.user;
    } catch (err) {
      console.error('Sign up failed:', err.code, err.message);
      throw err;
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      console.log('Google sign in success:', result.user);
      return result.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error.code, error.message);
      throw error;
    }
  };

  const handleSignInWithFacebook = async () => {
    try {
      const facebookProvider = new FacebookAuthProvider();
      const result = await signInWithPopup(firebaseAuth, facebookProvider);
      console.log('Facebook sign in success:', result.user);
      return result.user;
    } catch (error) {
      console.error('Facebook Sign-In Error:', error.code, error.message);
      throw error;
    }
  };

  const handleSignInWithGithub = async () => {
    try {
      const githubProvider = new GithubAuthProvider();
      const result = await signInWithPopup(firebaseAuth, githubProvider);
      console.log('Github sign in success:', result.user);
      return result.user;
    } catch (error) {
      console.error('Github Sign-In Error:', error.code, error.message);
      throw error;
    }
  };

  const handleSignInWithTwitter = async () => {
    try {
      const twitterProvider = new TwitterAuthProvider();
      const result = await signInWithPopup(firebaseAuth, twitterProvider);
      console.log('Twitter sign in success:', result.user);
      return result.user;
    } catch (error) {
      console.error('Twitter Sign-In Error:', error.code, error.message);
      throw error;
    }
  };

  const handleSignInWithEmailAndPassword = async (email, password) => {
    try {
      console.log('Trying login with:', email);
      console.log('Password length:', password?.length);

      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);

      console.log('Email login success:', result.user);
      return result.user;
    } catch (err) {
      console.error('Email login failed:', err.code, err.message);
      console.error(err);
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth);
      console.log('Sign out success');
    } catch (err) {
      console.error('Sign out failed:', err.code, err.message);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        signUpUserWithEmailAndPassword,
        handleSignInWithGoogle,
        handleSignInWithFacebook,
        handleSignInWithGithub,
        handleSignInWithEmailAndPassword,
        handleSignOut,
        handleSignInWithTwitter,
        user,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default FirebaseContextProvider;
