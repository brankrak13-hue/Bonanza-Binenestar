'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // 1. Check if we are in the Next.js build phase (static generation)
  // This is a special phase where process.env might not be fully loaded 
  // or FAH might provide incomplete FIREBASE_CONFIG.
  const isBuildPhase = typeof process !== 'undefined' && 
                      (process.env.NEXT_PHASE === 'phase-production-build' || 
                       process.env.NODE_ENV === 'production' && !process.env.FIREBASE_CONFIG && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  if (getApps().length) {
    const app = getApp();
    // If we're already initialized but missing the key during build, return dummy
    if (!app.options.apiKey && isBuildPhase) {
       return getSdks(app, true);
    }
    return getSdks(app);
  }

  let firebaseApp;
  
  // Check if automatic FIREBASE_CONFIG is present and valid for client SDKs
  let hasValidAutoConfig = false;
  try {
    const autoConfigStr = typeof process !== 'undefined' ? process.env.FIREBASE_CONFIG : null;
    const autoConfig = autoConfigStr ? (typeof autoConfigStr === 'string' ? JSON.parse(autoConfigStr) : autoConfigStr) : null;
    hasValidAutoConfig = !!(autoConfig && autoConfig.apiKey);
  } catch (e) {
    hasValidAutoConfig = false;
  }

  // If we are in build phase and NO source provides an apiKey, return a "safe" mock
  if (isBuildPhase && !hasValidAutoConfig && !firebaseConfig.apiKey) {
    console.warn('⚠️ Firebase Build Guard: Initialization bypassed during build phase to prevent errors.');
    return getSdks(null as any, true);
  }

  if (hasValidAutoConfig) {
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      firebaseApp = getApp();
    }
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp, isDummy: boolean = false) {
  // If we are forced into dummy mode (for build), we return stubs that don't trigger SDK logic
  if (isDummy || !firebaseApp || (!firebaseApp.options.apiKey && !firebaseConfig.apiKey)) {
    return {
      firebaseApp,
      get auth() { return {} as any; },
      get firestore() { return {} as any; }
    };
  }

  return {
    firebaseApp,
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
