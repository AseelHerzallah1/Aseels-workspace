import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authSecret =
  process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
const googleClientId =
  process.env.AUTH_GOOGLE_ID?.trim() || process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET?.trim() ||
  process.env.GOOGLE_CLIENT_SECRET?.trim();

if (!authSecret || !googleClientId || !googleClientSecret) {
  console.error("[auth] Missing env:", {
    hasAuthSecret: Boolean(authSecret),
    hasGoogleId: Boolean(googleClientId),
    hasGoogleSecret: Boolean(googleClientSecret),
  });
}

// Auth.js (NextAuth v5) — explicit env wiring for Vercel production.
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  trustHost: true,
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  pages: {
    error: "/auth/error",
  },
});
