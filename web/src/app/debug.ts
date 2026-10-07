import type { AuthState } from './viewer';

/** The interface that the RealWorld e2e tests read. */
export interface ConduitDebug {
  getToken: () => string | null;
  getAuthState: () => AuthState;
  getCurrentUser: () => {
    username: string;
    email: string;
    bio: string | null;
    image: string | null;
    token: string;
  } | null;
}

declare global {
  interface Window {
    __conduit_debug__?: ConduitDebug;
  }
}
