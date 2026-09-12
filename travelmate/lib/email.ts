import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailParams {
  to: string;
  name: string;
  verificationUrl: string;
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: SendVerificationEmailParams): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const { error } = await resend.emails.send({
    from: "TravelMate <onboarding@resend.dev>",
    to: [to],
    subject: "Verify your TravelMate email",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;padding:32px;background:#ffffff;border-radius:16px;">
            
            <h1 style="color:#0f766e;margin-bottom:8px;">
              Welcome to TravelMate 🌍
            </h1>

            <p style="font-size:16px;color:#334155;">
              Hi ${name},
            </p>

            <p style="font-size:16px;line-height:1.6;color:#475569;">
              Thanks for creating your TravelMate account.
              Please verify your email address to continue.
            </p>

            <div style="margin:32px 0;">
              <a
                href="${verificationUrl}"
                style="
                  display:inline-block;
                  padding:14px 24px;
                  background:#0f766e;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:10px;
                  font-weight:bold;
                "
              >
                Verify My Email
              </a>
            </div>

            <p style="font-size:14px;line-height:1.5;color:#64748b;">
              This verification link will expire in 24 hours.
            </p>

            <p style="font-size:14px;line-height:1.5;color:#64748b;">
              If you did not create a TravelMate account,
              you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;" />

            <p style="font-size:12px;color:#94a3b8;">
              © TravelMate. All rights reserved.
            </p>

          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("[Email] Verification email failed:", {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });

    throw new Error(error.message);
  }
}

interface SendPasswordResetEmailParams {
  to: string;
  name: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const { error } = await resend.emails.send({
    from: "TravelMate <onboarding@resend.dev>",
    to: [to],
    subject: "Reset your TravelMate password",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;padding:32px;background:#ffffff;border-radius:16px;">
            <h1 style="color:#0f766e;margin-bottom:8px;">
              TravelMate Password Reset 🔒
            </h1>
            <p style="font-size:16px;color:#334155;">
              Hi ${name},
            </p>
            <p style="font-size:16px;line-height:1.6;color:#475569;">
              We received a request to reset your password for your TravelMate account.
              Click the button below to set a new password.
            </p>
            <div style="margin:32px 0;">
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  padding:14px 24px;
                  background:#0f766e;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:10px;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>
            </div>
            <p style="font-size:14px;line-height:1.5;color:#64748b;">
              This password reset link will expire in 1 hour.
            </p>
            <p style="font-size:14px;line-height:1.5;color:#64748b;">
              If you did not request a password reset, you can safely ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;" />
            <p style="font-size:12px;color:#94a3b8;">
              © TravelMate. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("[Email] Password reset email failed:", {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
    throw new Error(error.message);
  }
}