'use client';
// Top-level imports removed to prevent build-time crashes. 
// Firebase SDKs are now imported dynamically inside guarded functions.
import type { User } from 'firebase/auth';

type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

interface FirebaseAuthToken {
  name: string | null;
  email: string | null;
  email_verified: boolean;
  phone_number: string | null;
  sub: string;
  firebase: {
    identities: Record<string, string[]>;
    sign_in_provider: string;
    tenant: string | null;
  };
}

interface FirebaseAuthObject {
  uid: string;
  token: FirebaseAuthToken;
}

interface SecurityRuleRequest {
  auth: FirebaseAuthObject | null;
  method: string;
  path: string;
  resource?: {
    data: any;
  };
}

/**
 * Builds a security-rule-compliant auth object from the Firebase User.
 * @param currentUser The currently authenticated Firebase user.
 * @returns An object that mirrors request.auth in security rules, or null.
 */
function buildAuthObject(currentUser: User | null): FirebaseAuthObject | null {
  if (!currentUser) {
    return null;
  }

  const token: FirebaseAuthToken = {
    name: currentUser.displayName,
    email: currentUser.email,
    email_verified: currentUser.emailVerified,
    phone_number: currentUser.phoneNumber,
    sub: currentUser.uid,
    firebase: {
      identities: currentUser.providerData.reduce((acc, p) => {
        if (p.providerId) {
          acc[p.providerId] = [p.uid];
        }
        return acc;
      }, {} as Record<string, string[]>),
      sign_in_provider: currentUser.providerData[0]?.providerId || 'custom',
      tenant: currentUser.tenantId,
    },
  };

  return {
    uid: currentUser.uid,
    token: token,
  };
}

async function buildRequestObject(context: SecurityRuleContext): Promise<SecurityRuleRequest> {
  let authObject: FirebaseAuthObject | null = null;
  try {
    // 1. Check if we are in a safe environment (client-side or with valid app)
    const { getApps } = await import('firebase/app');
    const apps = getApps();
    
    // 2. ONLY proceed if an app exists AND it has an apiKey.
    // This prevents the "Neither apiKey nor config.authenticator provided" error
    // during the Next.js static generation phase.
    if (apps.length > 0 && apps[0].options.apiKey) {
      const { getAuth } = await import('firebase/auth');
      const firebaseAuth = getAuth();
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        authObject = buildAuthObject(currentUser);
      }
    }
  } catch (err) {
    // This will catch errors if the Firebase app is not yet initialized or fails validation.
    console.warn('FirestorePermissionError: Auth context unavailable during build or initialization.', err);
  }

  return {
    auth: authObject,
    method: context.operation,
    path: `/databases/(default)/documents/${context.path}`,
    resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
  };
}

/**
 * Builds the final, formatted error message for the LLM.
 * @param requestObject The simulated request object.
 * @returns A string containing the error message and the JSON payload.
 */
function buildErrorMessage(requestObject: SecurityRuleRequest): string {
  return `Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(requestObject, null, 2)}`;
}

/**
 * A custom error class designed to be consumed by an LLM for debugging.
 * It structures the error information to mimic the request object
 * available in Firestore Security Rules.
 */
export class FirestorePermissionError extends Error {
  public request: SecurityRuleRequest | null = null;

  constructor(context: SecurityRuleContext) {
    super('Firestore permission denied. Initializing request details...');
    this.name = 'FirebaseError';
    
    // We handle the async resolution of the request object separately 
    // to avoid blocking the constructor (which must be sync).
    this.initRequest(context);
  }

  private async initRequest(context: SecurityRuleContext) {
    try {
      this.request = await buildRequestObject(context);
      this.message = buildErrorMessage(this.request);
    } catch {
      this.message = 'Firestore permission denied (Details unavailable).';
    }
  }
}
