/// <reference types="vite/client" />

interface ClerkSession {
  getToken: () => Promise<string | null>;
}

interface ClerkWindow {
  session?: ClerkSession | null;
}

declare global {
  interface Window {
    Clerk?: ClerkWindow;
  }
}

export {};
