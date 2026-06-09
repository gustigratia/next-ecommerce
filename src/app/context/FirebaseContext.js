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
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpUserWithEmailAndPassword = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return result.user;
    } catch (err) {
      throw err;
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const handleSignInWithFacebook = async () => {
    try {
      const facebookProvider = new FacebookAuthProvider();
      const result = await signInWithPopup(firebaseAuth, facebookProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const handleSignInWithGithub = async () => {
    try {
      const githubProvider = new GithubAuthProvider();
      const result = await signInWithPopup(firebaseAuth, githubProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const handleSignInWithTwitter = async () => {
    try {
      const twitterProvider = new TwitterAuthProvider();
      const result = await signInWithPopup(firebaseAuth, twitterProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const handleSignInWithEmailAndPassword = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return result.user;
    } catch (err) {
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
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
