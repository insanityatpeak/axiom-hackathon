/**
 * Application configuration.
 *
 * Sensitive values (API keys) are never hardcoded here.
 * They are loaded from environment variables (VITE_*) or
 * provided at runtime via the UI.
 *
 * VITE_* variables are embedded at build time. The .env file
 * is excluded from version control (see .gitignore) so
 * secret values never leak to GitHub.
 */

/** Groq API key — set via VITE_GROQ_API_KEY in .env or at runtime */
export const GROQ_API_KEY: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as Record<string, any>).env?.VITE_GROQ_API_KEY) ||
  '';
