'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

/** 
 * CRITICAL: Build-phase detection for Next.js 15.
 * We must detect when we are in the 'phase-production-build' to prevent 
 * Firebase SDK from crashing due to missing API keys.
 */
function isBuildEnvironment() {
  return typeof process !== 'undefined' && 
         (process.env.NEXT_PHASE === 'phase-production-build' || 
          process.env.NODE_ENV === 'production' && !process.env.FIREBASE_CONFIG && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
}

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isBuild = isBuildEnvironment();

  if (getApps().length) {
    const app = getApp();
    if (!app.options.apiKey && isBuild) {
       return getSdks(app, true);
    }
    return getSdks(app);
  }

  let firebaseApp: FirebaseApp;
  
  // Check if automatic FIREBASE_CONFIG is present
  let hasValidAutoConfig = false;
  try {
    const autoConfigStr = typeof process !== 'undefined' ? process.env.FIREBASE_CONFIG : null;
    const autoConfig = autoConfigStr ? (typeof autoConfigStr === 'string' ? JSON.parse(autoConfigStr) : autoConfigStr) : null;
    hasValidAutoConfig = !!(autoConfig && autoConfig.apiKey);
  } catch (e) {
    hasValidAutoConfig = false;
  }

  // Build Guard: Return a safe dummy if no keys are found during build
  if (isBuild && !hasValidAutoConfig && !firebaseConfig.apiKey) {
    console.warn('⚠️ Firebase Build Guard: Returning dummy SDKs.');
    return getSdks({ options: {}, name: '[DEFAULT]' } as any, true);
  }

  if (hasValidAutoConfig) {
    try {
      firebaseApp = initializeApp();
    } catch (e) {
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
  const isBuild = isBuildEnvironment();
  const shouldMock = isDummy || isBuild || !firebaseApp?.options?.apiKey;

  return {
    firebaseApp,
    get auth() { 
      if (shouldMock) {
        return {
          currentUser: null,
          onAuthStateChanged: () => () => {},
          signOut: async () => {},
          signInAnonymously: async () => ({ user: null }),
          signInWithEmailAndPassword: async () => ({ user: null }),
          createUserWithEmailAndPassword: async () => ({ user: null }),
        } as any;
      }
      return getAuth(firebaseApp); 
    },
    get firestore() { 
      if (shouldMock) {
        return { 
          __isDummy: true,
          type: 'firestore',
          toJSON: () => ({})
        } as any;
      }
      return getFirestore(firebaseApp); 
    }
  };
}

// --- GUARDED WRAPPERS (USE THESE INSTEAD OF DIRECT SDK IMPORTS) ---

const checkClient = () => typeof window !== 'undefined' && !isBuildEnvironment();

export async function signOut() {
  if (!checkClient()) return;
  const { auth } = initializeFirebase();
  const { signOut: firebaseSignOut } = await import('firebase/auth');
  return firebaseSignOut(auth);
}

export async function signInWithEmailAndPassword(...args: [any, string, string]) {
  if (!checkClient()) return { user: null } as any;
  const { signInWithEmailAndPassword: firebaseSignIn } = await import('firebase/auth');
  return firebaseSignIn(...args);
}

export async function createUserWithEmailAndPassword(...args: [any, string, string]) {
  if (!checkClient()) return { user: null } as any;
  const { createUserWithEmailAndPassword: firebaseCreate } = await import('firebase/auth');
  return firebaseCreate(...args);
}

export async function updateProfile(user: any, profile: any) {
  if (!checkClient() || !user) return;
  const { updateProfile: firebaseUpdate } = await import('firebase/auth');
  return firebaseUpdate(user, profile);
}

export async function sendPasswordResetEmail(auth: any, email: string, settings?: any) {
  if (!checkClient()) return;
  const { sendPasswordResetEmail: firebaseSend } = await import('firebase/auth');
  return firebaseSend(auth, email, settings);
}

export async function confirmPasswordReset(code: string, newPass: string) {
  if (!checkClient()) return;
  const { auth } = initializeFirebase();
  const { confirmPasswordReset: firebaseConfirm } = await import('firebase/auth');
  return firebaseConfirm(auth, code, newPass);
}

export async function verifyPasswordResetCode(code: string) {
  if (!checkClient()) return "";
  const { auth } = initializeFirebase();
  const { verifyPasswordResetCode: firebaseVerify } = await import('firebase/auth');
  return firebaseVerify(auth, code);
}

export async function signInAnonymously(auth: any) {
  if (!checkClient()) return { user: null } as any;
  const { signInAnonymously: firebaseSignIn } = await import('firebase/auth');
  return firebaseSignIn(auth);
}

// --- FIRESTORE WRAPPERS ---

export function doc(db: any, ...args: any[]) {
  if (!checkClient() || db?.__isDummy) return { __isDummy: true } as any;
  const { doc: firebaseDoc } = require('firebase/firestore');
  return firebaseDoc(db, ...args);
}

export function collection(db: any, ...args: any[]) {
  if (!checkClient() || db?.__isDummy) return { __isDummy: true } as any;
  const { collection: firebaseCollection } = require('firebase/firestore');
  return firebaseCollection(db, ...args);
}

export function query(ref: any, ...args: any[]) {
  if (!checkClient() || ref?.__isDummy) return { __isDummy: true } as any;
  const { query: firebaseQuery } = require('firebase/firestore');
  return firebaseQuery(ref, ...args);
}

export function orderBy(...args: any[]) {
  if (!checkClient()) return {} as any;
  const { orderBy: firebaseOrderBy } = require('firebase/firestore');
  return firebaseOrderBy(...args);
}

export async function setDoc(ref: any, data: any, options?: any) {
  if (!checkClient() || ref?.__isDummy) return;
  const { setDoc: firebaseSet } = await import('firebase/firestore');
  return firebaseSet(ref, data, options);
}

export async function addDoc(ref: any, data: any) {
  if (!checkClient() || ref?.__isDummy) return { id: 'dummy' } as any;
  const { addDoc: firebaseAdd } = await import('firebase/firestore');
  return firebaseAdd(ref, data);
}

export async function updateDoc(ref: any, data: any) {
  if (!checkClient() || ref?.__isDummy) return;
  const { updateDoc: firebaseUpdate } = await import('firebase/firestore');
  return firebaseUpdate(ref, data);
}

export async function deleteDoc(ref: any) {
  if (!checkClient() || ref?.__isDummy) return;
  const { deleteDoc: firebaseDelete } = await import('firebase/firestore');
  return firebaseDelete(ref);
}

// --- APP CHECK ---

export async function initializeGuardedAppCheck(app: any, provider: any) {
  if (!checkClient() || !app?.options?.apiKey) return;
  const { initializeAppCheck: firebaseInit } = await import('firebase/app-check');
  return firebaseInit(app, { provider, isTokenAutoRefreshEnabled: true });
}

export { 
  type User, 
  type Auth 
} from 'firebase/auth';
export { type FirebaseApp } from 'firebase/app';
export { 
  type Firestore, 
  type DocumentReference, 
  type CollectionReference, 
  type Query, 
  type DocumentData, 
  type FirestoreError, 
  type DocumentSnapshot,
  type QuerySnapshot,
  type QueryDocumentSnapshot,
  type SetOptions
} from 'firebase/firestore';

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

