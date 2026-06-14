import { NextResponse } from "next/server";

/** Safe production check — booleans only, no secret values. Remove after debugging. */
export const runtime = "nodejs";

export async function GET() {
  const secret =
    process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim() || "";
  const googleId =
    process.env.AUTH_GOOGLE_ID?.trim() || process.env.GOOGLE_CLIENT_ID?.trim() || "";
  const googleSecret =
    process.env.AUTH_GOOGLE_SECRET?.trim() ||
    process.env.GOOGLE_CLIENT_SECRET?.trim() ||
    "";

  return NextResponse.json({
    ok: Boolean(secret && googleId && googleSecret),
    hasAuthSecret: secret.length > 0,
    authSecretLength: secret.length,
    hasGoogleId: googleId.length > 0,
    googleIdSuffix: googleId.slice(-20) || null,
    hasGoogleSecret: googleSecret.length > 0,
    authUrl: process.env.AUTH_URL || null,
    trustHost: process.env.AUTH_TRUST_HOST || null,
    nodeEnv: process.env.NODE_ENV,
  });
}
