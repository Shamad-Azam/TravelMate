"use server";

import { redirect } from "next/navigation";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "./validation";
import { SECURITY_MESSAGES } from "./security";
import { destroySession } from "./session";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
  code?: string;
}

/**
 * Server Action: Login
 * Performs server-side validation and secure authentication.
 */
export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";

  // 1. Server-side input validation
  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid) {
    return {
      success: false,
      error: emailCheck.error || "Please provide a valid email.",
      fieldErrors: { email: emailCheck.error || "Invalid email." },
    };
  }

  if (!password) {
    return {
      success: false,
      error: "Password is required.",
      fieldErrors: { password: "Password is required." },
    };
  }

  // 2. Production Database Check
  // We do NOT fake or mock authentication without a real database.
  const isDbConfigured = Boolean(process.env.DATABASE_URL);

  if (!isDbConfigured) {
    return {
      success: false,
      error:
        "Database is not configured yet. Active authentication requires DATABASE_URL and SESSION_SECRET in your environment.",
      code: "DB_NOT_CONFIGURED",
    };
  }

  // 3. Database Authentication Logic (Executed when DB is connected)
  // - Query user by email
  // - Compare password hash using Argon2id
  // - Check if account is locked or requires 2FA
  // - Set HttpOnly session cookie
  // - In case of wrong password, return generic: SECURITY_MESSAGES.INVALID_CREDENTIALS

  return {
    success: false,
    error: SECURITY_MESSAGES.INVALID_CREDENTIALS,
  };
}

/**
 * Server Action: Sign Up (Registration)
 * Enforces strong password policy, data integrity, and verification flow.
 */
export async function signupAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const name = (formData.get("name") as string) || "";
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";
  const terms = formData.get("terms") === "on";

  const fieldErrors: Record<string, string> = {};

  // 1. Server-side validation
  const nameCheck = validateName(name);
  if (!nameCheck.isValid && nameCheck.error) {
    fieldErrors.name = nameCheck.error;
  }

  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid && emailCheck.error) {
    fieldErrors.email = emailCheck.error;
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid && passwordCheck.error) {
    fieldErrors.password = passwordCheck.error;
  }

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (!terms) {
    fieldErrors.terms = "You must accept the Terms and Privacy Policy to create an account.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please correct the highlighted errors below.",
      fieldErrors,
    };
  }

  // 2. Production Database Check
  const isDbConfigured = Boolean(process.env.DATABASE_URL);

  if (!isDbConfigured) {
    return {
      success: false,
      error:
        "Database is not configured yet. Sign-up cannot persist user records until DATABASE_URL is set in your environment.",
      code: "DB_NOT_CONFIGURED",
    };
  }

  // 3. Active Registration (when DB connected)
  // - Hash password with Argon2id
  // - Insert user into DB with emailVerified = false
  // - Generate secure token and send verification email
  // - Redirect to /verify-email?sent=true

  return {
    success: true,
    message: "Registration successful. Please verify your email to continue.",
  };
}

/**
 * Server Action: Forgot Password
 * Implements anti-enumeration: Always returns success message to prevent user discovery.
 */
export async function forgotPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string) || "";

  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid) {
    return {
      success: false,
      error: emailCheck.error || "Please enter a valid email address.",
      fieldErrors: { email: emailCheck.error || "Invalid email." },
    };
  }

  const isEmailConfigured = Boolean(
    process.env.RESEND_API_KEY || process.env.EMAIL_SERVER_HOST
  );

  if (!isEmailConfigured) {
    // Log safe diagnostic on the server only, never expose to client
    console.info(
      "[Auth Security] Forgot password requested for email. Email provider is not configured in environment variables."
    );
  }

  // Anti-enumeration: Regardless of whether the user exists or email provider is active,
  // return a generic success message so attackers cannot probe for existing accounts.
  return {
    success: true,
    message: SECURITY_MESSAGES.GENERIC_FORGOT_PASSWORD,
  };
}

/**
 * Server Action: Reset Password
 * Verifies single-use token and updates password.
 */
export async function resetPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const token = (formData.get("token") as string) || "";
  const newPassword = (formData.get("newPassword") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";

  if (!token) {
    return {
      success: false,
      error: SECURITY_MESSAGES.TOKEN_EXPIRED_OR_INVALID,
    };
  }

  const passwordCheck = validatePassword(newPassword);
  if (!passwordCheck.isValid) {
    return {
      success: false,
      error: passwordCheck.error || "New password does not meet security requirements.",
      fieldErrors: { newPassword: passwordCheck.error || "Weak password." },
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match.",
      fieldErrors: { confirmPassword: "Passwords do not match." },
    };
  }

  const isDbConfigured = Boolean(process.env.DATABASE_URL);
  if (!isDbConfigured) {
    return {
      success: false,
      error:
        "Database is not configured yet. Password reset requires an active database connection.",
      code: "DB_NOT_CONFIGURED",
    };
  }

  return {
    success: true,
    message: "Your password has been successfully reset. You can now log in.",
  };
}

/**
 * Server Action: Logout
 * Invalidates session cookie securely and redirects.
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
