"use server";

import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { prisma } from "@/lib/db";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "./validation";
import { SECURITY_MESSAGES } from "./security";
import { createSession, destroySession } from "./session";
import {
  createVerificationToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
  invalidatePasswordResetToken,
} from "./verification";
import { sendVerificationEmail, sendPasswordResetEmail } from "../email";
import { getAppBaseUrl } from "./google";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
  code?: string;
}

/**
 * Server Action: Login
 * Validates credentials, verifies Argon2id hash against PostgreSQL,
 * enforces email verification, sets an HttpOnly session cookie, and redirects.
 */
export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawEmail = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const email = rawEmail.trim().toLowerCase();

  // 1. Validate inputs
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

  // 2. Query user from database
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("[Auth] Login database query error:", error);
    return {
      success: false,
      error: "Unable to connect to service. Please try again.",
    };
  }

  // Generic rejection if user does not exist
  if (!user) {
    return {
      success: false,
      error: SECURITY_MESSAGES.INVALID_CREDENTIALS,
    };
  }

  // 3. Verify Argon2id password hash
  if (!user.passwordHash) {
    return {
      success: false,
      error: "This account was registered using Google. Please click 'Continue with Google' to sign in.",
    };
  }

  let isPasswordValid = false;
  try {
    isPasswordValid = await argon2.verify(user.passwordHash, password);
  } catch (error) {
    console.error("[Auth] Argon2 verify error:", error);
    return {
      success: false,
      error: SECURITY_MESSAGES.INVALID_CREDENTIALS,
    };
  }

  if (!isPasswordValid) {
    return {
      success: false,
      error: SECURITY_MESSAGES.INVALID_CREDENTIALS,
    };
  }

  // 4. Enforce email verification
  if (!user.isEmailVerified) {
    return {
      success: false,
      error:
        "Please verify your email address before logging in. A verification link was sent to your email.",
      code: "EMAIL_NOT_VERIFIED",
    };
  }

  // 5. Create database-backed session & HttpOnly cookie
  try {
    await createSession(user.id);
  } catch (error) {
    console.error("[Auth] Session creation error:", error);
    return {
      success: false,
      error: "Failed to establish secure session. Please try again.",
    };
  }

  redirect("/dashboard");
}

/**
 * Server Action: Sign Up (Registration)
 * Enforces validation, Argon2id password hashing, creates user in PostgreSQL,
 * generates verification token, sends verification email, and redirects to verification page.
 */
export async function signupAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawName = (formData.get("name") as string) || "";
  const rawEmail = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";
  const terms = formData.get("terms") === "on";

  const name = rawName.trim();
  const email = rawEmail.trim().toLowerCase();

  const fieldErrors: Record<string, string> = {};

  // 1. Validation
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
    fieldErrors.terms =
      "You must accept the Terms and Privacy Policy to create an account.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please correct the highlighted errors below.",
      fieldErrors,
    };
  }

  // 2. Check for duplicate email
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email address already exists.",
        fieldErrors: {
          email: "An account with this email already exists.",
        },
      };
    }
  } catch (error) {
    console.error("[Auth] Duplicate check database error:", error);
    return {
      success: false,
      error: "Database error. Please try again later.",
    };
  }

  // 3. Hash password using Argon2id
  let passwordHash: string;
  try {
    passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
  } catch (error) {
    console.error("[Auth] Argon2 hash error:", error);
    return {
      success: false,
      error: "Error securing password. Please try again.",
    };
  }

  // 4. Create user in database
  let newUser;
  try {
    newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        isEmailVerified: false,
      },
    });
  } catch (error) {
    console.error("[Auth] User creation error:", error);
    return {
      success: false,
      error: "Failed to create account. Please try again.",
    };
  }

  // 5. Generate verification token and send email
  try {
    const token = await createVerificationToken(newUser.id);
    const appUrl = getAppBaseUrl();
    const verificationUrl = `${appUrl}/verify-email?token=${token}`;

    await sendVerificationEmail({
      to: email,
      name,
      verificationUrl,
    });
  } catch (error) {
    console.error("[Auth] Failed to send verification email:", error);
    // Proceed to redirect user so they can view the verification instructions or request a resend
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

/**
 * Server Action: Forgot Password
 * Generates single-use token, sends reset email, implements anti-enumeration defense.
 */
export async function forgotPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawEmail = (formData.get("email") as string) || "";
  const email = rawEmail.trim().toLowerCase();

  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid) {
    return {
      success: false,
      error: emailCheck.error || "Please enter a valid email address.",
      fieldErrors: { email: emailCheck.error || "Invalid email." },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const token = await createPasswordResetToken(user.id);
      const appUrl = getAppBaseUrl();
      const resetUrl = `${appUrl}/reset-password?token=${token}`;


      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    }
  } catch (error) {
    console.error("[Auth] Forgot password error:", error);
  }

  // Anti-enumeration: always return generic confirmation
  return {
    success: true,
    message: SECURITY_MESSAGES.GENERIC_FORGOT_PASSWORD,
  };
}

/**
 * Server Action: Reset Password
 * Verifies single-use reset token, hashes new password with Argon2id,
 * updates user record, and invalidates active sessions.
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
      error:
        passwordCheck.error ||
        "New password does not meet security requirements.",
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

  try {
    const userId = await verifyPasswordResetToken(token);

    if (!userId) {
      return {
        success: false,
        error: SECURITY_MESSAGES.TOKEN_EXPIRED_OR_INVALID,
      };
    }

    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await invalidatePasswordResetToken(token);

    // Invalidate all existing sessions for this user
    await prisma.session.deleteMany({
      where: { userId },
    });

    return {
      success: true,
      message:
        "Your password has been successfully reset. You can now log in.",
    };
  } catch (error) {
    console.error("[Auth] Reset password error:", error);
    return {
      success: false,
      error: "Unable to reset password. Please request a new link.",
    };
  }
}

/**
 * Server Action: Logout
 * Invalidates session in database, deletes session cookie, and redirects to /login.
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

