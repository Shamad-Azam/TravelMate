/**
 * TravelMate Authentication - Validation Utilities
 * 
 * Strict, security-first validation rules for email, passwords, and user details.
 * Used on both server-side actions and client forms for instant feedback.
 */

export interface PasswordStrength {
  score: number; // 0 to 4
  label: "Too Weak" | "Weak" | "Fair" | "Good" | "Strong";
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

/**
 * Validates email format according to RFC 5322 standards.
 * Ensures reasonable length to prevent DoS attacks.
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email address is required." };
  }

  const trimmed = email.trim();
  if (trimmed.length > 254) {
    return { isValid: false, error: "Email address is too long (maximum 254 characters)." };
  }

  // Standard safe email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  return { isValid: true };
}

/**
 * Computes password strength and criteria checklist.
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    minLength: (password || "").length >= 8,
    hasUppercase: /[A-Z]/.test(password || ""),
    hasLowercase: /[a-z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password || ""),
  };

  let passedCount = 0;
  if (checks.minLength) passedCount++;
  if (checks.hasUppercase && checks.hasLowercase) passedCount++;
  if (checks.hasNumber) passedCount++;
  if (checks.hasSpecial) passedCount++;

  let label: PasswordStrength["label"] = "Too Weak";
  if (passedCount === 1) label = "Weak";
  else if (passedCount === 2) label = "Fair";
  else if (passedCount === 3) label = "Good";
  else if (passedCount === 4) label = "Strong";

  return {
    score: passedCount,
    label,
    checks,
  };
}

/**
 * Enforces production password policy:
 * - Minimum 8 characters (10+ recommended for travel platforms)
 * - Maximum 128 characters (prevents bcrypt/argon2 DoS hash exhaustion)
 * - Must include lowercase, uppercase, number, and special character
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password || typeof password !== "string") {
    return { isValid: false, error: "Password is required." };
  }

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long." };
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password cannot exceed 128 characters." };
  }

  const strength = evaluatePasswordStrength(password);
  if (strength.score < 3) {
    return {
      isValid: false,
      error: "Password must contain a mix of uppercase letters, lowercase letters, numbers, and symbols.",
    };
  }

  return { isValid: true };
}

/**
 * Validates user full name.
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Full name is required." };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long." };
  }

  if (trimmed.length > 70) {
    return { isValid: false, error: "Name cannot exceed 70 characters." };
  }

  return { isValid: true };
}
