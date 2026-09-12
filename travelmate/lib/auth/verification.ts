import crypto from "crypto";
import { prisma } from "@/lib/db";

const VERIFICATION_TOKEN_DURATION_MS =
  1000 * 60 * 60 * 24; // 24 hours

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashVerificationToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function createVerificationToken(
  userId: string
): Promise<string> {
  // Delete older tokens for this user
  await prisma.verificationToken.deleteMany({
    where: {
      userId,
    },
  });

  // Generate secure random token
  const token = generateVerificationToken();

  // Store only the hash in database
  const tokenHash = hashVerificationToken(token);

  // Token expires after 24 hours
  const expiresAt = new Date(
    Date.now() + VERIFICATION_TOKEN_DURATION_MS
  );

  await prisma.verificationToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function verifyEmailToken(
  token: string
): Promise<string | null> {
  if (!token) {
    return null;
  }

  const tokenHash = hashVerificationToken(token);

  const verificationToken =
    await prisma.verificationToken.findUnique({
      where: {
        tokenHash,
      },
    });

  if (!verificationToken) {
    return null;
  }

  // Check expiry
  if (verificationToken.expiresAt <= new Date()) {
    await prisma.verificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    return null;
  }

  // Verify user's email
  await prisma.user.update({
    where: {
      id: verificationToken.userId,
    },
    data: {
      isEmailVerified: true,
    },
  });

  // Delete token so it cannot be reused
  await prisma.verificationToken.delete({
    where: {
      id: verificationToken.id,
    },
  });

  return verificationToken.userId;
}

const PASSWORD_RESET_TOKEN_DURATION_MS =
  1000 * 60 * 60; // 1 hour

export async function createPasswordResetToken(
  userId: string
): Promise<string> {
  // Delete older reset tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  });

  const token = generateVerificationToken();
  const tokenHash = hashVerificationToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_DURATION_MS);

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function verifyPasswordResetToken(
  token: string
): Promise<string | null> {
  if (!token) {
    return null;
  }

  const tokenHash = hashVerificationToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!resetToken) {
    return null;
  }

  if (resetToken.expiresAt <= new Date()) {
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    return null;
  }

  return resetToken.userId;
}

export async function invalidatePasswordResetToken(
  token: string
): Promise<void> {
  if (!token) {
    return;
  }

  const tokenHash = hashVerificationToken(token);

  await prisma.passwordResetToken.deleteMany({
    where: {
      tokenHash,
    },
  });
}