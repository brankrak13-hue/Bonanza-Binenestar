'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    const app = getApp();
    // If the existing app is missing the apiKey and we have one in our config
    if (!app.options.apiKey && firebaseConfig.apiKey) {
       // In some environments (like FAH build), the auto-initialized app is incomplete.
       // However, by checking BEFORE init in the next block, we prevent this state.
    }
    return getSdks(app);
  }

  let firebaseApp;
  
  // Check if automatic FIREBASE_CONFIG is present and valid for client SDKs
  let hasValidAutoConfig = false;
  try {
    const autoConfigStr = typeof process !== 'undefined' ? process.env.FIREBASE_CONFIG : null;
    const autoConfig = autoConfigStr ? JSON.parse(autoConfigStr) : null;
    hasValidAutoConfig = !!(autoConfig && autoConfig.apiKey);
  } catch (e) {
    hasValidAutoConfig = false;
  }

  if (hasValidAutoConfig) {
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    // No auto-config or invalid (like in FAH build phase). Use hardcoded config.
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      // If re-initialization fails because it's already there but broken
      firebaseApp = getApp();
    }
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    // We use getters to make initialization lazy. This is crucial for the build phase 
    // in Next.js, as it prevents getAuth() or getFirestore() from being called 
    // immediately during module tracing/evaluation.
    get auth() { return getAuth(firebaseApp); },
    get firestore() { return getFirestore(firebaseApp); }
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
