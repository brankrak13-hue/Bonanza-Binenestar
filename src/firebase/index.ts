'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
      
      // CRITICAL FIX: Firebase App Hosting sometimes provides an incomplete FIREBASE_CONFIG 
      // during the build phase (missing apiKey). This causes getAuth() and other client SDKs to fail.
      // We check if apiKey is present; if not, we force a fallback to our hardcoded config.
      if (!firebaseApp.options.apiKey && firebaseConfig.apiKey) {
        throw new Error("Missing apiKey in automatic initialization (common during build phase)");
      }
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed or incomplete. Falling back to firebase config object.', e);
      }
      
      // If already initialized but missing apiKey, we try to initialize with config
      try {
        firebaseApp = initializeApp(firebaseConfig);
      } catch (err) {
        // Fallback to existing app if re-initialization fails
        firebaseApp = getApp();
      }
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
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
