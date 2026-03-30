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
  // We use getters to make initialization completely lazy.
  // CRITICAL: We avoid calling getAuth() and getFirestore() during the 
  // Next.js build phase to prevent crashes when API keys are not present.
  const isBuildPhase = typeof process !== 'undefined' && 
                      (process.env.NEXT_PHASE === 'phase-production-build' || 
                       process.env.NODE_ENV === 'production' && !process.env.FIREBASE_CONFIG && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  return {
    firebaseApp,
    get auth() { 
      if (isDummy || isBuildPhase || !firebaseApp?.options?.apiKey) {
        return {
          currentUser: null,
          onAuthStateChanged: () => () => {},
          // Stubs for Auth methods
          signOut: async () => {},
          signInAnonymously: async () => ({ user: null }),
          signInWithEmailAndPassword: async () => ({ user: null }),
          createUserWithEmailAndPassword: async () => ({ user: null }),
          confirmPasswordReset: async () => {},
          verifyPasswordResetCode: async () => "",
        } as any;
      }
      return getAuth(firebaseApp); 
    },
    get firestore() { 
      if (isDummy || isBuildPhase || !firebaseApp?.options?.apiKey) {
        return {
          collection: () => ({}),
          doc: () => ({}),
        } as any;
      }
      return getFirestore(firebaseApp); 
    }
  };
}

// --- GUARDED SDK WRAPPERS (To avoid direct imports in UI components) ---

export async function signOut() {
  const { auth } = initializeFirebase();
  const { signOut: firebaseSignOut } = await import('firebase/auth');
  return firebaseSignOut(auth);
}

// Fixed doc and collection wrappers (guarded)
export function doc(db: Firestore, ...args: [string, ...string[]]) {
  if (typeof window === 'undefined') return {} as any;
  // This is a synchronous call in Firebase SDK but we still want to avoid top-level issues
  const { doc: firebaseDoc } = require('firebase/firestore');
  return firebaseDoc(db, ...args);
}

export function collection(db: Firestore, path: string) {
  if (typeof window === 'undefined') return {} as any;
  const { collection: firebaseCollection } = require('firebase/firestore');
  return firebaseCollection(db, path);
}

export async function createUserWithEmailAndPassword(...args: [import('firebase/auth').Auth, string, string]) {
  const { createUserWithEmailAndPassword: firebaseCreate } = await import('firebase/auth');
  return firebaseCreate(...args);
}

export async function updateProfile(...args: [import('firebase/auth').User, { displayName?: string | null; photoURL?: string | null }]) {
  const { updateProfile: firebaseUpdate } = await import('firebase/auth');
  return firebaseUpdate(...args);
}

export async function sendPasswordResetEmail(...args: [import('firebase/auth').Auth, string, import('firebase/auth').ActionCodeSettings?]) {
  const { sendPasswordResetEmail: firebaseSend } = await import('firebase/auth');
  return firebaseSend(...args);
}

export async function confirmPasswordReset(code: string, newPass: string) {
  const { auth } = initializeFirebase();
  const { confirmPasswordReset: firebaseConfirm } = await import('firebase/auth');
  return firebaseConfirm(auth, code, newPass);
}

export async function verifyPasswordResetCode(code: string) {
  const { auth } = initializeFirebase();
  const { verifyPasswordResetCode: firebaseVerify } = await import('firebase/auth');
  return firebaseVerify(auth, code);
}

export async function signInAnonymously(auth: import('firebase/auth').Auth) {
  const { signInAnonymously: firebaseSignIn } = await import('firebase/auth');
  return firebaseSignIn(auth);
}

export async function signInWithEmailAndPassword(...args: [import('firebase/auth').Auth, string, string]) {
  const { signInWithEmailAndPassword: firebaseSignIn } = await import('firebase/auth');
  return firebaseSignIn(...args);
}

import { Firestore } from 'firebase/firestore';

export async function getGuardedFirestore() {
   return initializeFirebase().firestore;
}

// These are used for type definitions mostly, but we can also provide guarded wrappers
// for common firestore functions if they are imported directly.
export { type User, type Auth } from 'firebase/auth';
export { type FirebaseApp } from 'firebase/app';
export { type Firestore } from 'firebase/firestore';

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

