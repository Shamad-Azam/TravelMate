/**
 * TravelMate Authentication - Validation Utilities
 *
 * Security-focused validation for email, passwords, and user details.
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
 * Validates an email address.
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email || typeof email !== "string") {
    return {
      isValid: false,
      error: "Email address is required.",
    };
  }

  const trimmed = email.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "Email address is required.",
    };
  }

  if (trimmed.length > 254) {
    return {
      isValid: false,
      error: "Email address is too long.",
    };
  }

  // Safe practical email validation matching standard emails (e.g. user@gmail.com, name@example.com)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Please enter a valid email address.",
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Evaluates password strength.
 */
export function evaluatePasswordStrength(
  password: string
): PasswordStrength {
  const value = password || "";

  const checks = {
    minLength: value.length >= 8,
    hasUppercase: /[A-Z]/.test(value),
    hasLowercase: /[a-z]/.test(value),
    hasNumber: /[0-9]/.test(value),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
  };

  let passedCount = 0;

  if (checks.minLength) {
    passedCount++;
  }

  if (checks.hasUppercase && checks.hasLowercase) {
    passedCount++;
  }

  if (checks.hasNumber) {
    passedCount++;
  }

  if (checks.hasSpecial) {
    passedCount++;
  }

  let label: PasswordStrength["label"] = "Too Weak";

  if (passedCount === 1) {
    label = "Weak";
  } else if (passedCount === 2) {
    label = "Fair";
  } else if (passedCount === 3) {
    label = "Good";
  } else if (passedCount === 4) {
    label = "Strong";
  }

  return {
    score: passedCount,
    label,
    checks,
  };
}

/**
 * Validates password according to TravelMate security policy.
 *
 * Requirements:
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - Uppercase letter
 * - Lowercase letter
 * - Number
 * - Special character
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!password || typeof password !== "string") {
    return {
      isValid: false,
      error: "Password is required.",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long.",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password cannot exceed 128 characters.",
    };
  }

  const strength = evaluatePasswordStrength(password);

  if (
    !strength.checks.hasUppercase ||
    !strength.checks.hasLowercase ||
    !strength.checks.hasNumber ||
    !strength.checks.hasSpecial
  ) {
    return {
      isValid: false,
      error:
        "Password must contain uppercase, lowercase, number, and special character.",
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validates user's full name.
 */
export function validateName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name || typeof name !== "string") {
    return {
      isValid: false,
      error: "Full name is required.",
    };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: "Name must be at least 2 characters long.",
    };
  }

  if (trimmed.length > 70) {
    return {
      isValid: false,
      error: "Name cannot exceed 70 characters.",
    };
  }

  return {
    isValid: true,
  };
}