import crypto from "crypto";

/**
 * TravelMate Authentication - Cryptographic & Security Utilities
 * 
 * Implements security-first cryptographic standards:
 * - CSPRNG token generation
 * - SHA-256 token hashing for database storage (single-use reset & verification tokens)
 * - Timing-attack resistant constant-time comparison
 */

/**
 * Generates a cryptographically secure random token (e.g. for email verification or password reset).
 * Default 32 bytes = 64 hex characters (256 bits of entropy).
 */
export function generateSecureToken(byteLength: number = 32): string {
  return crypto.randomBytes(byteLength).toString("hex");
}

/**
 * Hashes a token using SHA-256 before storing it in the database.
 * Security standard: Even if the database is compromised, raw reset/verification
 * tokens cannot be used to compromise accounts.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Compares two strings in constant time to prevent timing attacks.
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }

  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    // Constant time dummy comparison
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Standard generic error responses to prevent account enumeration.
 * Attackers cannot determine whether an email exists in the database.
 */
export const SECURITY_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  GENERIC_FORGOT_PASSWORD:
    "If an account exists with this email, you will receive password reset instructions shortly.",
  TOKEN_EXPIRED_OR_INVALID:
    "This link is invalid or has expired. Please request a new one.",
  ACCOUNT_LOCKED:
    "Too many failed login attempts. For security reasons, please try again in a few minutes.",
} as const;
